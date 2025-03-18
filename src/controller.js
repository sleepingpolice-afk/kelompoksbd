//wkwkwk ty technoskill 1.0

const pg = require("./connect");
const cloudinary = require("cloudinary").v2;

exports.getAll = async function getAll(req, res) {
    try {
        const result = await pg.query('SELECT * FROM stores');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.create = async function create(req, res) {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: 'Name and address are required' });
    }

    try {
        const result = await pg.query(
            'INSERT INTO stores(name, address) VALUES($1, $2) RETURNING *',
            [name, address]
        );
    res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting store:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getID = async function getID(req, res) {
    try {
        const { id } = req.params;
      const response = await pg.query("SELECT * FROM stores WHERE id = $1", [id]);

      return res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({message: "Store not found"});
    }
};

exports.updateStore = async function updateStore(req, res) {
    try {
        const { id } = req.body;
        const { name, address } = req.body;
        const response = await pg.query("UPDATE stores SET name = $1, address = $2 WHERE id = $3", [name, address, id]);
        
        //res.json(name, address);

        res.status(200).json({ message: "Store updated successfully" });
    } catch (error) {
        res.status(500).json({message: "Update Store Failed"});
    }
}

exports.deleteStore = async function deleteStore(req, res){
    try{
        const {id} = req.params;
        const response = await pg.query("DELETE FROM stores WHERE id = $1", [id]);
    if (response.rowCount === 0) {
        return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json({message: "Store deleted successfully"});
} catch (error) {
    res.status(500).json({message: "Delete Store Unsuccesful"});
}
}

exports.register = async function register(req, res){


    if (!req.query.email || !req.query.password || !req.query.name) {
        return res.status(400).json({ message: 'Tidak boleh kosong!' });
    }

    try {
        const result = await pg.query(
            'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
            [req.query.name, req.query.email, req.query.password]
        );
    res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ message: 'Fail to register' });
    }
}


exports.login = async function login(req, res){
    if (!req.query.email || !req.query.password) {
        return res.status(400).json({ message: 'Tidak boleh kosong!' });
    }

    try {
        const result = await pg.query(
            'SELECT * FROM users WHERE email = $1 and password = $2',
            [req.query.email, req.query.password]
        );
    if(result.rowCount == 0){
        return res.status(400).json({ message: 'Email atau password salah' });
    }
    res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Fail to login' });
    }
}

exports.getEmail = async function getEmail(req, res) {
    try {
        const { email } = req.params;
      const response = await pg.query("SELECT * FROM users WHERE email = $1", [email]);

      if(response.rowCount === 0){
            return res.status(404).json({message: "User not found"});
        }

      return res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateUser = async function updateUser(req, res) {
    try {
        const { email, password, name, id } = req.body;
        const response = await pg.query("UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4", [email, password, name, id]);
        
        //res.json(name, address);

        if(response.rowCount === 0){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
        res.status(500).json({message: "fail to update user"});
    }
}

exports.deleteUser = async function deleteUser(req, res){
    try{
        const response = await pg.query("DELETE FROM users WHERE id = $1", [req.params.id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        } else {
            return res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

cloudinary.config({
    cloud_name: 'dp1jezm2q',
    api_key: '668728787957176',
    api_secret: 'pq1Zz-U8gCwX1bjajZolUvcAj-E',
    secure: true
});


exports.createItem = async function createItem(req, res) {
    const { name, price, store_id, stock } = req.body;
    const image = req.file;

    try {
        if (!image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        //pakai upload stream katanya biar diupload langsung ke cloudinary.
        const uploadResult = await cloudinary.uploader.upload_stream(
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
                }

                // Save the image URL from Cloudinary
                const imageUrl = result.secure_url;

                try {
                    const queryResult = await pg.query(
                        'INSERT INTO items(name, price, store_id, image_url, stock) VALUES($1, $2, $3, $4, $5) RETURNING *',
                        [name, price, store_id, imageUrl, stock]
                    );
                    res.status(201).json({ success: true, message: 'Item created', payload: queryResult.rows[0] });
                } catch (error) {
                    return res.status(500).json({ success: false, message: 'Internal Server error or Store not found', payload: null });
                }
            }
        );

        // Upload the file buffer to Cloudinary
        uploadResult.end(image.buffer);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', payload: null });
    }
};

exports.getAllItem = async function getAllItem(req, res) {
    try {
        const result = await pg.query('SELECT * FROM items');
        res.status(200).json({success: true, message: 'Items found', payload: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', payload: null });
    }
}

exports.getItemById = async function getItemById(req, res) {
    try {
        const { id } = req.params;
      const response = await pg.query("SELECT * FROM items WHERE id = $1", [id]);

      if(response.rowCount === 0){
            return res.status(404).json({message: "Item not found"});
        }

      return res.status(200).json({success: true, message: 'Item found', payload: response.rows[0]});
    } catch (error) {
        res.status(500).json({success: false, message: 'Item not found', payload: null});
    }
};

exports.getItemByStoreId = async function getItemByStoreId(req, res) {
    try {
        const { store_id } = req.params;
      const response = await pg.query("SELECT * FROM items WHERE store_id = $1", [store_id]);

      if(response.rowCount === 0){
            return res.status(404).json({success:true, message: "Item not found", payload: null});
        }

      return res.status(200).json({success: 'true', message: 'Item found', payload: response.rows});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Store not found', payload: null});
    }
}

exports.updateItem = async function updateItem(req, res) {
    try {
        const { id, name, price, store_id, stock } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadResult = await cloudinary.uploader.upload_stream(
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
                }

                const imageUrl = result.secure_url;

                try {
                    const queryResult = await pg.query(
                        'UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *',
                        [name, price, store_id, imageUrl, stock, id]
                    );
                    res.status(200).json({ success: true, message: 'Item updated', payload: queryResult.rows[0] });
                } catch (error) {
                    return res.status(500).json({ success: false, message: 'Store or Item not found', payload: null });
                }
            }
        );

        uploadResult.end(image.buffer);

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', payload: null });
    }
}

exports.deleteItem = async function deleteItem(req, res) {
    try {
        const { id } = req.params;

        //cek apakah item ada sebelum delete
        const print = await pg.query("SELECT * FROM items WHERE id = $1", [id]);
        
        if (print.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Item not found", payload: null });
        }
        const itemToDelete = print.rows[0];
        
        const response = await pg.query("DELETE FROM items WHERE id = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json({success: true, message: "Item deleted successfully", payload: itemToDelete});

    } catch (error) {
        return res.status(404).json({ success: false, message: "Item not found", payload: null });
    }
};

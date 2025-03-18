const pg = require("./connect");

exports.getProduct = async function(req, res) {
    try {
        const result = await pg.query("SELECT * FROM produk");
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal mendapatkan produk atau produk kosong" });
    }
}

exports.addProduct = async (req, res) => {
    const { nama_produk, kategori, harga, stok, deskripsi } = req.body;
    try {
        const response = await pg.query("INSERT INTO produk (nama_produk, kategori, harga, stok, deskripsi) VALUES ($1, $2, $3, $4, $5)", [nama_produk, kategori, harga, stok, deskripsi]);
        res.status(200).json({success: true, message: "produk berhasil ditambahkan", hasil: response.rows[0]});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal menambahkan produk" });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id_produk, nama_produk, kategori, harga, stok, deskripsi } = req.body;
        const response = await pg.query("UPDATE produk SET nama_produk = $1, kategori = $2, harga = $3, stok = $4, deskripsi = $5 WHERE id_produk = $6 RETURNING *", 
            [nama_produk, kategori, harga, stok, deskripsi, id_produk]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "produk tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "produk berhasil diupdate", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mengupdate produk" });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pg.query("DELETE FROM produk WHERE id_produk = $1 RETURNING *", [id]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "produk tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "produk berhasil dihapus", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menghapus produk" });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const result = await pg.query("SELECT * FROM users");
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal mendapatkan user atau user kosong" });
    }
}

exports.addUser = async (req, res) => {
    const { nama, email, password, alamat, no_telepon } = req.body;
    try {
        const response = await pg.query("INSERT INTO users (nama, email, password, alamat, no_telepon) VALUES ($1, $2, $3, $4, $5)", [nama, email, password, alamat, no_telepon]);
        res.status(200).json({success: true, message: "user berhasil ditambahkan", hasil: response.rows[0]});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal menambahkan user" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id_user, nama, email, password, alamat, no_telepon } = req.body;
        const response = await pg.query("UPDATE users SET nama = $1, email = $2, password = $3, alamat = $4, no_telepon = $5 WHERE id_user = $6 RETURNING *", 
            [nama, email, password, alamat, no_telepon, id_user]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "user tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "user berhasil diupdate", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mengupdate user" });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pg.query("DELETE FROM users WHERE id_user = $1 RETURNING *", [id]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "user tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "user berhasil dihapus", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menghapus user" });
    }
}

exports.getPesanan = async (req, res) => {
    try {
        const result = await pg.query("SELECT * FROM pesanan");
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mendapatkan pesanan atau pesanan kosong" });
    }
}

exports.getPesananById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pg.query("SELECT * FROM pesanan WHERE id_pesanan = $1", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, hasil: result.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mendapatkan pesanan" });
    }
}

exports.getPesananByUser = async (req, res) => {
    try {
        const { id_user } = req.params;
        const result = await pg.query("SELECT * FROM pesanan WHERE id_user = $1", [id_user]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mendapatkan pesanan" });
    }
}

exports.addPesanan = async (req, res) => {
    try {
        const { id_user, total_harga, status } = req.body;
        
        if (!id_user || !total_harga) {
            return res.status(400).json({ success: false, message: "id_user dan total_harga diperlukan" });
        }
        
        let query, params;
        if (status) {
            query = "INSERT INTO pesanan (id_user, total_harga, status) VALUES ($1, $2, $3) RETURNING *";
            params = [id_user, total_harga, status];
        } else {
            query = "INSERT INTO pesanan (id_user, total_harga) VALUES ($1, $2) RETURNING *";
            params = [id_user, total_harga];
        }
        
        const response = await pg.query(query, params);
        res.status(201).json({success: true, message: "pesanan berhasil ditambahkan", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menambahkan pesanan" });
    }
}

exports.updateStatusPesanan = async (req, res) => {
    try {
        const { id_pesanan, status } = req.body;
        
        if (!id_pesanan || !status) {
            return res.status(400).json({ success: false, message: "id_pesanan dan status diperlukan" });
        }
        
        const validStatus = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "status tidak valid. Status yang valid: " + validStatus.join(', ')
            });
        }
        
        const response = await pg.query(
            "UPDATE pesanan SET status = $1 WHERE id_pesanan = $2 RETURNING *",
            [status, id_pesanan]
        );
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "status pesanan berhasil diupdate", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mengupdate status pesanan" });
    }
}

exports.updatePesanan = async (req, res) => {
    try {
        const { id_pesanan, id_user, total_harga, status } = req.body;
        
        if (!id_pesanan) {
            return res.status(400).json({ success: false, message: "id_pesanan diperlukan" });
        }
        
        if (status) {
            const validStatus = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
            if (!validStatus.includes(status)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "status tidak valid. Status yang valid: " + validStatus.join(', ')
                });
            }
        }
        
        const response = await pg.query(
            "UPDATE pesanan SET id_user = COALESCE($1, id_user), total_harga = COALESCE($2, total_harga), status = COALESCE($3, status) WHERE id_pesanan = $4 RETURNING *",
            [id_user, total_harga, status, id_pesanan]
        );
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "pesanan berhasil diupdate", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mengupdate pesanan" });
    }
}

exports.deletePesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pg.query("DELETE FROM pesanan WHERE id_pesanan = $1 RETURNING *", [id]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "pesanan berhasil dihapus", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menghapus pesanan" });
    }
}

exports.getRincianPesanan = async (req, res) => {
    try {
        const { id_pesanan } = req.params;
        const result = await pg.query(`
            SELECT r.*, p.nama_produk 
            FROM rincian_pesanan r
            JOIN produk p ON r.id_produk = p.id_produk  
            WHERE id_pesanan = $1
        `, [id_pesanan]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "rincian pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mendapatkan rincian pesanan" });
    }
}

exports.addRincianPesanan = async (req, res) => {
    try {
        const { id_pesanan, id_produk, jumlah, harga } = req.body;
        
        if (!id_pesanan || !id_produk || !jumlah || !harga) {
            return res.status(400).json({ 
                success: false, 
                message: "id_pesanan, id_produk, jumlah, dan harga diperlukan" 
            });
        }
        
        const response = await pg.query(
            "INSERT INTO rincian_pesanan (id_pesanan, id_produk, jumlah, harga) VALUES ($1, $2, $3, $4) RETURNING *",
            [id_pesanan, id_produk, jumlah, harga]
        );
        
        res.status(201).json({success: true, message: "rincian pesanan berhasil ditambahkan", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menambahkan rincian pesanan" });
    }
}

exports.updateRincianPesanan = async (req, res) => {
    try {
        const { id_rincian, jumlah, harga } = req.body;
        
        if (!id_rincian) {
            return res.status(400).json({ success: false, message: "id_rincian diperlukan" });
        }
        
        const response = await pg.query(
            "UPDATE rincian_pesanan SET jumlah = COALESCE($1, jumlah), harga = COALESCE($2, harga) WHERE id_rincian = $3 RETURNING *",
            [jumlah, harga, id_rincian]
        );
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "rincian pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "rincian pesanan berhasil diupdate", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal mengupdate rincian pesanan" });
    }
}

exports.deleteRincianPesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await pg.query("DELETE FROM rincian_pesanan WHERE id_rincian = $1 RETURNING *", [id]);
        
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "rincian pesanan tidak ditemukan" });
        }
        
        res.status(200).json({success: true, message: "rincian pesanan berhasil dihapus", hasil: response.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "gagal menghapus rincian pesanan" });
    }
}

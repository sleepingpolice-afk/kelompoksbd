const pg = require("./connect");

exports.getproduct = async function getproduct(req, res) {
    try {
        const result = await pg.query("SELECT * FROM produk");
        res.status(200).json({success: true, hasil: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal mendapatkan produk atau produk kosong" });
    }
}

exports.addproduct = async (req, res) => {
    const { nama_produk, kategori, harga, stok, deskripsi } = req.body;
    try {
        const response = await pg.query("INSERT INTO produk (nama_produk, kategori, harga, stok, deskripsi) VALUES ($1, $2, $3, $4, $5)", [nama_produk, kategori, harga, stok, deskripsi]);
        res.status(200).json({success: true, message: "produk berhasil ditambahkan", hasil: response.rows[0]});
    } catch (error) {
        res.status(500).json({ success: false, message: "gagal menambahkan produk" });
    }
}
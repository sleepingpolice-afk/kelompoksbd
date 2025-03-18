CREATE TYPE categories AS ENUM ('Makanan', 'Minuman', 'Snack', 'Perlengkapan Rumah', 'Perlengkapan Dapur', 'Perlengkapan Kamar Mandi', 'Perlengkapan Tidur', 'Perlengkapan Sekolah', 'Perlengkapan Kantor', 'Perlengkapan Elektronik', 'Perlengkapan Olahraga', 'Perlengkapan Hewan', 'Perlengkapan Bayi', 'Perlengkapan Anak', 'Perlengkapan Dewasa', 'Perlengkapan Lansia', 'Perlengkapan Daur Ulang', 'Perlengkapan Kesehatan', 'Perlengkapan Fashion', 'Perlengkapan Kecantikan', 'Perlengkapan Hobi', 'Perlengkapan Lainnya');

CREATE TABLE produk (
    id_produk INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    kategori categories DEFAULT 'Perlengkapan Lainnya',
    harga BIGINT CHECK(harga >= 0),
    stok INT CHECK(stok >= 0),
    deskripsi TEXT,
);

CREATE TABLE user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    alamat TEXT,
    no_telepon VARCHAR(15)
);

CREATE TABLE keranjang_belanja (
    id_keranjang INT AUTO_INCREMENT PRIMARY KEY,
    id_user BIGINT,
    id_produk INT,
    jumlah INT CHECK(jumlah >= 0),
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE
);

CREATE TABLE pesanan (
    id_pesanan INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    total_harga DECIMAL(10, 2),
    tanggal_pesanan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu Pembayaran',
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE
);

CREATE TABLE rincian_pesanan (
    id_rincian INT AUTO_INCREMENT PRIMARY KEY,
    id_pesanan INT,
    id_produk INT,
    jumlah INT,
    harga DECIMAL(10, 2),
    FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE,
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE
);

CREATE TABLE pembayaran (
    id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
    id_pesanan INT,
    metode_pembayaran ENUM('Transfer Bank', 'Kartu Kredit', 'E-wallet'),
    jumlah DECIMAL(10, 2),
    status ENUM('Menunggu Konfirmasi', 'Diterima', 'Ditolak') DEFAULT 'Menunggu Konfirmasi',
    tanggal_pembayaran TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE
);

CREATE TYPE categories AS ENUM ('Makanan', 'Minuman', 'Snack', 'Perlengkapan Rumah', 'Perlengkapan Dapur', 'Perlengkapan Kamar Mandi', 'Perlengkapan Tidur', 'Perlengkapan Sekolah', 'Perlengkapan Kantor', 'Perlengkapan Elektronik', 'Perlengkapan Olahraga', 'Perlengkapan Hewan', 'Perlengkapan Bayi', 'Perlengkapan Anak', 'Perlengkapan Dewasa', 'Perlengkapan Lansia', 'Perlengkapan Daur Ulang', 'Perlengkapan Kesehatan', 'Perlengkapan Fashion', 'Perlengkapan Kecantikan', 'Perlengkapan Hobi', 'Perlengkapan Lainnya');
CREATE TYPE status_pesanan AS ENUM ('Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan');
CREATE TYPE status_pembayaran AS ENUM('Menunggu Konfirmasi', 'Diterima', 'Ditolak');
CREATE TYPE methods AS ENUM('Transfer Bank', 'Kartu Kredit', 'E-wallet');

CREATE TABLE produk (
    id_produk SERIAL PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    kategori categories DEFAULT 'Perlengkapan Lainnya',
    harga BIGINT CHECK(harga >= 0),
    stok INT CHECK(stok >= 0),
    deskripsi TEXT
);

CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    nama VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    alamat TEXT,
    no_telepon VARCHAR(15)
);

CREATE TABLE keranjang_belanja (
    id_keranjang SERIAL PRIMARY KEY,
    id_user BIGINT,
    id_produk INT,
    jumlah INT CHECK(jumlah >= 0),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE
);

CREATE TABLE pesanan (
    id_pesanan SERIAL PRIMARY KEY,
    id_user INT,
    total_harga BIGINT CHECK(total_harga >= 0),
    tanggal_pesanan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status status_pesanan DEFAULT 'Menunggu Pembayaran',
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE rincian_pesanan (
    id_rincian SERIAL PRIMARY KEY,
    id_pesanan INT,
    id_produk INT,
    jumlah INT CHECK(jumlah >= 0),
    harga BIGINT CHECK(harga >= 0),
    FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE,
    FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE
);

CREATE TABLE pembayaran (
    id_pembayaran SERIAL PRIMARY KEY,
    id_pesanan INT,
    metode_pembayaran methods DEFAULT 'Transfer Bank',
    jumlah BIGINT CHECK(jumlah >= 0),
    status status_pembayaran DEFAULT 'Menunggu Konfirmasi',
    tanggal_pembayaran TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan) ON DELETE CASCADE
);

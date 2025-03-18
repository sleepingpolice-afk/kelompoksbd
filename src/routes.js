const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/product/get", controller.getProduct);
router.post("/product/add", controller.addProduct);
router.put("/product/update/", controller.updateProduct);
router.delete("/product/delete/:id", controller.deleteProduct);

router.get("/user/get", controller.getUsers);
router.post("/user/add", controller.addUser);
router.put("/user/update/", controller.updateUser);
router.delete("/user/delete/:id", controller.deleteUser);

router.get("/pesanan/get", controller.getPesanan);
router.get("/pesanan/get/:id", controller.getPesananById);
router.get("/pesanan/user/:id_user", controller.getPesananByUser);
router.post("/pesanan/add", controller.addPesanan);
router.put("/pesanan/update", controller.updatePesanan);
router.put("/pesanan/update-status", controller.updateStatusPesanan);
router.delete("/pesanan/delete/:id", controller.deletePesanan);

router.get("/rincian-pesanan/:id_pesanan", controller.getRincianPesanan);
router.post("/rincian-pesanan/add", controller.addRincianPesanan);
router.put("/rincian-pesanan/update", controller.updateRincianPesanan);
router.delete("/rincian-pesanan/delete/:id", controller.deleteRincianPesanan);

module.exports = router;

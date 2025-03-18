const express = require("express");
const router = express.Router();
const controller = require("./controller"); 

router.get("/product", controller.getproduct);
router.post("/addproduct", controller.addproduct);

module.exports = router;
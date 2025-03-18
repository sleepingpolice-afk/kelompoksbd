//wkwkwk ty technoskill 1.0

const express = require("express");
const router = express.Router();
const controller = require("./controller"); 

// Define the routes
router.post("/create", controller.create);  
router.get("/getAll", controller.getAll);  
router.get("/:id", controller.getID)
router.put("/", controller.updateStore)
router.delete("/:id", controller.deleteStore)

module.exports = router;

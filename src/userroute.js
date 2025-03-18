//wkwkwk ty technoskill 1.0

const express = require("express");
const router = express.Router();
const controller = require("./controller"); 

// Define the routes
router.post("/register", controller.register);  
router.post("/login", controller.login);
router.get("/:email", controller.getEmail);
router.put("/", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;

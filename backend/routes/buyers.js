const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");

router.get("/", buyerController.getAllBuyers);
router.get("/:id", buyerController.getBuyerById);
router.post("/", buyerController.createBuyer);
router.put("/:id", buyerController.updateBuyer);
router.delete("/:id", buyerController.deleteBuyer);

module.exports = router;
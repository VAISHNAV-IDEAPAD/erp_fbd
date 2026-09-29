const express = require("express");
const router = express.Router();
const productionReceiptController =
require("../controllers/productionReceiptController");

router.get("/", productionReceiptController.getAllReceipts);
router.get("/:id", productionReceiptController.getReceiptById);
router.post("/", productionReceiptController.createReceipt);

module.exports = router;
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.get("/overview", purchaseController.getOverview);
router.get("/supplier-ledger", purchaseController.getSupplierLedger);
router.get("/", purchaseController.getOverview);

module.exports = router;
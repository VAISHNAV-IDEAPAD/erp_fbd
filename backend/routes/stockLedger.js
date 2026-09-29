const express = require("express");
const router = express.Router();

const stockLedgerController =
require("../controllers/stockLedgerController");

router.get("/", stockLedgerController.getAllLedger);

router.get("/:itemId",
stockLedgerController.getItemLedger);

module.exports = router;
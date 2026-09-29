const express = require("express");
const router = express.Router();

const controller =
require("../controllers/stockSummaryController");

router.get(
    "/",
    controller.getStockSummary
);

module.exports = router;
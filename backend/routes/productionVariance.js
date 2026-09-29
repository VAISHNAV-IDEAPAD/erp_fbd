const express = require("express");
const router = express.Router();

const controller =
require("../controllers/productionVarianceController");

router.get("/", controller.getProductionVariance);

module.exports = router;
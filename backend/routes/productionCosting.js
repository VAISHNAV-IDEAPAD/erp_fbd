const express = require("express");
const router = express.Router();

const controller =
require("../controllers/productionCostingController");

router.get(
    "/",
    controller.getAllCosting
);

router.get(
    "/:id",
    controller.getCostingByProduction
);

router.post(
    "/",
    controller.createCosting
);

module.exports = router;
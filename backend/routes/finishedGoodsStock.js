const express = require("express");
const router = express.Router();

const controller = require(
    "../controllers/finishedGoodsStockController"
);

router.get(
    "/",
    controller.getFinishedGoods
);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller =
require("../controllers/finishedGoodsAgeingController");

router.get("/", controller.getFinishedGoodsAgeing);

module.exports = router;
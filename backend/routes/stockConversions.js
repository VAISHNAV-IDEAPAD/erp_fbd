const express = require("express");
const router = express.Router();
const controller = require("../controllers/stockConversionController");

router.get("/", controller.getAllStockConversions);
router.get("/:id", controller.getStockConversionById);
router.post("/", controller.createStockConversion);
router.put("/:id", controller.updateStockConversion);
router.delete("/:id", controller.deleteStockConversion);

module.exports = router;

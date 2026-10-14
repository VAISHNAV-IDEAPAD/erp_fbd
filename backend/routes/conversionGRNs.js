const express = require("express");
const router = express.Router();
const controller = require("../controllers/conversionGRNController");

router.get("/", controller.getAllConversionGRNs);
router.get("/:id", controller.getConversionGRNById);
router.post("/", controller.createConversionGRN);
router.put("/:id", controller.updateConversionGRN);
router.delete("/:id", controller.deleteConversionGRN);

module.exports = router;

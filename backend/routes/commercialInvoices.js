const express = require("express");
const router = express.Router();
const controller = require("../controllers/commercialInvoiceController");

router.get("/", controller.getCommercialInvoices);
router.get("/:id", controller.getCommercialInvoiceById);
router.post("/", controller.createCommercialInvoice);
router.put("/:id", controller.updateCommercialInvoice);
router.delete("/:id", controller.deleteCommercialInvoice);

module.exports = router;

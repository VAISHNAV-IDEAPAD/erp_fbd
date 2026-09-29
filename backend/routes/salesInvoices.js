const express = require("express");
const router = express.Router();

const controller =
require("../controllers/salesInvoiceController");

router.get(
    "/",
    controller.getAllInvoices
);

router.post(
    "/",
    controller.createInvoice
);

module.exports = router;
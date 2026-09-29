const express = require("express");
const router = express.Router();

const controller =
require("../controllers/customerPaymentController");

router.get(
    "/",
    controller.getAllPayments
);

router.post(
    "/",
    controller.createPayment
);

module.exports = router;
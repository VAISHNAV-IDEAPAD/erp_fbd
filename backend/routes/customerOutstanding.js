const express = require("express");
const router = express.Router();

const controller =
require("../controllers/customerOutstandingController");

router.get(
    "/",
    controller.getCustomerOutstanding
);

module.exports = router;
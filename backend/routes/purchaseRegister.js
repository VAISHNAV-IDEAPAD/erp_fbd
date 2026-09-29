const express = require("express");
const router = express.Router();

const controller =
require("../controllers/purchaseRegisterController");

router.get(
    "/",
    controller.getPurchaseRegister
);

module.exports = router;
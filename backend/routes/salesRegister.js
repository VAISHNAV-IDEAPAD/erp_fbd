const express = require("express");
const router = express.Router();

const controller =
require("../controllers/salesRegisterController");

router.get(
    "/",
    controller.getSalesRegister
);

module.exports = router;
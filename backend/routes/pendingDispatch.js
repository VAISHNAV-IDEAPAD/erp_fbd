const express = require("express");
const router = express.Router();

const controller =
require("../controllers/pendingDispatchController");

router.get(
    "/",
    controller.getPendingDispatch
);

module.exports = router;
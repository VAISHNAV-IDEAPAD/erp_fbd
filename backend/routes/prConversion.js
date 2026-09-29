const express = require("express");
const router = express.Router();

const controller =
    require("../controllers/prConversionController");


router.get(
    "/pending/:prId",
    controller.getPendingPRItems
);

router.post(
    "/convert",
    controller.convertPRToPO
);

module.exports = router;
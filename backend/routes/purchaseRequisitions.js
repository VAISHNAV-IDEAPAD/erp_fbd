const express = require("express");
const router = express.Router();

const prController =
    require("../controllers/prController");

// =====================================
// GET ALL PR
// =====================================
router.get(
    "/",
    prController.getAllPR
);

// =====================================
// GET PENDING PR BY ID
// IMPORTANT: Keep this ABOVE "/:id"
// =====================================
router.get(
    "/pending/:id",
    prController.getPendingPR
);

// =====================================
// GET PR BY ID
// =====================================
router.get(
    "/:id",
    prController.getPRById
);

// =====================================
// CREATE PR
// =====================================
router.post(
    "/",
    prController.createPR
);

// =====================================
// CONVERT PR TO PURCHASE ORDER
// =====================================
router.post(
    "/:id/convert-to-po",
    prController.convertToPO
);

module.exports = router;
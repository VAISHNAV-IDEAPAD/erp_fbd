const express = require("express");

const router = express.Router();

const colourController =
    require("../controllers/colourController");


// =====================================================
// COLOUR MASTER
// =====================================================

// Get all colours
router.get(
    "/",
    colourController.getAllColours
);


// Get colour by ID
router.get(
    "/:id",
    colourController.getColourById
);


// Create colour
router.post(
    "/",
    colourController.createColour
);


// Update colour
router.put(
    "/:id",
    colourController.updateColour
);


// Delete colour
router.delete(
    "/:id",
    colourController.deleteColour
);


module.exports = router;
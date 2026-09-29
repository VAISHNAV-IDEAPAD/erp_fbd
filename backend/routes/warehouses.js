const express = require("express");

const router = express.Router();

const warehouseController =
    require("../controllers/warehouseController");

// =====================================================
// GET ALL WAREHOUSES
// =====================================================

router.get(
    "/",
    warehouseController.getAllWarehouses
);


// =====================================================
// GET ACTIVE WAREHOUSES
// ITEM ISSUE LOOKUP
// =====================================================

router.get(
    "/active",
    warehouseController.getActiveWarehouses
);


// =====================================================
// GET WAREHOUSE BY ID
// =====================================================

router.get(
    "/:id",
    warehouseController.getWarehouseById
);


// =====================================================
// CREATE WAREHOUSE
// =====================================================

router.post(
    "/",
    warehouseController.createWarehouse
);


// =====================================================
// UPDATE WAREHOUSE
// =====================================================

router.put(
    "/:id",
    warehouseController.updateWarehouse
);


// =====================================================
// DELETE WAREHOUSE
// =====================================================

router.delete(
    "/:id",
    warehouseController.deleteWarehouse
);


module.exports = router;
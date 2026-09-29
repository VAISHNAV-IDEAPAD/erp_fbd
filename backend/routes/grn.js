const express = require("express");

const router = express.Router();

const purchaseOrderController =
    require("../controllers/purchaseOrderController");


// ===============================
// Get All Purchase Orders
// ===============================
router.get(
    "/",
    purchaseOrderController.getAllPurchaseOrders
);


// ===============================
// Get Purchase Order Details
// IMPORTANT: Keep this BEFORE /:id
// ===============================
router.get(
    "/:id/details",
    purchaseOrderController.getPurchaseOrderDetails
);


// ===============================
// Get Purchase Order By ID
// ===============================
router.get(
    "/:id",
    purchaseOrderController.getPurchaseOrderById
);


// ===============================
// Add Purchase Order
// ===============================
router.post(
    "/",
    purchaseOrderController.addPurchaseOrder
);


// ===============================
// Update Purchase Order
// ===============================
router.put(
    "/:id",
    purchaseOrderController.updatePurchaseOrder
);


// ===============================
// Delete Purchase Order
// ===============================
router.delete(
    "/:id",
    purchaseOrderController.deletePurchaseOrder
);


module.exports = router;
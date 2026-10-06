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
// IMPORTANT: BEFORE /:id
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
// Update Purchase Order Status
// ===============================
router.patch(
    "/:id/status",
    purchaseOrderController.updateStatus
);


// ===============================
// Bulk Action
// ===============================
router.post(
    "/bulk-action",
    purchaseOrderController.bulkAction
);


// ===============================
// Delete Purchase Order
// ===============================
router.delete(
    "/:id",
    purchaseOrderController.deletePurchaseOrder
);


module.exports = router;
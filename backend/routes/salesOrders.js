const express = require("express");
const router = express.Router();

const controller =
require("../controllers/salesOrderController");

router.get(
    "/",
    controller.getAllSalesOrders
);

router.get(
    "/:id",
    controller.getSalesOrderById
);

router.post(
    "/",
    controller.createSalesOrder
);

module.exports = router;
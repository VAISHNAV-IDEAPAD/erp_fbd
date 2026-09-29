const express = require("express");

const router = express.Router();

const departmentController = require("../controllers/departmentController");

router.get("/", departmentController.getAll);

router.get("/:id", departmentController.getById);

module.exports = router;
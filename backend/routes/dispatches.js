const express = require("express");
const router = express.Router();

const controller =
require("../controllers/dispatchController");

router.get("/", controller.getAllDispatch);

router.post("/", controller.createDispatch);

module.exports = router;
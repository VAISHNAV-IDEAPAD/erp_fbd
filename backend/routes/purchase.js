const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Module under development"
    });
});

module.exports = router;
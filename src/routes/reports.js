const express = require("express");
const { monthlyReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/monthly", monthlyReport);

module.exports = router;

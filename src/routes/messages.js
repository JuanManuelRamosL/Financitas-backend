const express = require("express");
const { processMessage } = require("../controllers/messageController");

const router = express.Router();
router.post("/", processMessage);

module.exports = router;

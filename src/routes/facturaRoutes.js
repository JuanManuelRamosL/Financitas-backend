const express = require("express");
const { emitirFactura } = require("../controllers/facturaController");

const router = express.Router();

// POST /facturas
router.post("/", emitirFactura);

module.exports = router;

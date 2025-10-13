const express = require("express");
const {
  createUser,
  getPaidStatus,
  updatePaidStatus,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
// Consultar si pagó el mes
router.get("/:id/paid", getPaidStatus);

// Actualizar estado de pago
router.put("/:id/paid", updatePaidStatus);
module.exports = router;

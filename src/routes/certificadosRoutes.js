const express = require("express");
const multer = require("multer");
const { uploadCertificados } = require("../controllers/certificadosController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /certificados/subir
router.post(
  "/subir",
  upload.fields([
    { name: "cert", maxCount: 1 }, // archivo .crt
    { name: "key", maxCount: 1 }, // archivo .key
  ]),
  uploadCertificados
);

module.exports = router;

const fs = require("fs");
const path = require("path");
const User = require("../models/User");

async function uploadCertificados(req, res) {
  try {
    const { puntoVenta } = req.body;
    const userId = req.user?.id || req.body.userId; // depende de tu auth
    if (!userId)
      return res.status(400).json({ error: "Usuario no autenticado" });

    // Verificamos que existan ambos archivos
    if (!req.files || !req.files.cert || !req.files.key) {
      return res.status(400).json({ error: "Faltan archivos .crt o .key" });
    }

    // Buscamos el usuario
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // Creamos carpeta para ese usuario si no existe
    const userDir = path.join(__dirname, `../certs/${user.cuit}`);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    // Guardamos los archivos
    const certPath = path.join(userDir, "cert.crt");
    const keyPath = path.join(userDir, "key.key");

    fs.writeFileSync(certPath, req.files.cert[0].buffer);
    fs.writeFileSync(keyPath, req.files.key[0].buffer);

    // Actualizamos la BD
    user.certPath = certPath;
    user.keyPath = keyPath;
    if (puntoVenta) user.puntoVenta = puntoVenta;
    await user.save();

    res.json({
      success: true,
      message: "Certificados subidos correctamente",
      certPath,
      keyPath,
      puntoVenta: user.puntoVenta,
    });
  } catch (error) {
    console.error("Error subiendo certificados:", error);
    res
      .status(500)
      .json({ error: "Error subiendo certificados", detalles: error.message });
  }
}

module.exports = { uploadCertificados };

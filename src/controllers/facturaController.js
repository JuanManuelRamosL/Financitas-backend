const Afip = require("@afipsdk/afip.js");
const User = require("../models/User");

async function emitirFactura(req, res) {
  try {
    const { docNro, importeNeto, importeIVA, tipo } = req.body;
    const userId = req.user?.id; // o lo que uses para obtener al usuario autenticado

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.cuit || !user.puntoVenta || !user.certPath || !user.keyPath) {
      return res.status(400).json({
        error:
          "El usuario no tiene configurado CUIT, certificado o punto de venta",
      });
    }

    // Instancia AFIP con los datos del usuario
    const afip = new Afip({
      CUIT: Number(user.cuit),
      cert: user.certPath,
      key: user.keyPath,
      production: true,
    });

    const ptoVta = user.puntoVenta;
    const data = {
      CantReg: 1,
      PtoVta: ptoVta,
      CbteTipo: tipo || 6, // Factura B por defecto
      Concepto: 1,
      DocTipo: 80, // CUIT cliente
      DocNro: parseInt(docNro),
      CbteDesde: 1,
      CbteHasta: 1,
      CbteFch: parseInt(
        new Date().toISOString().slice(0, 10).replace(/-/g, "")
      ),
      ImpTotal: importeNeto + importeIVA,
      ImpTotConc: 0,
      ImpNeto: importeNeto,
      ImpOpEx: 0,
      ImpIVA: importeIVA,
      ImpTrib: 0,
      MonId: "PES",
      MonCotiz: 1,
      Iva: [
        {
          Id: 5,
          BaseImp: importeNeto,
          Importe: importeIVA,
        },
      ],
    };

    const response = await afip.ElectronicBilling.createVoucher(data);

    res.json({
      success: true,
      CAE: response.CAE,
      vencimiento: response.CAEFchVto,
      nroComprobante: response.CbteDesde,
    });
  } catch (error) {
    console.error("Error al emitir factura:", error);
    res.status(500).json({
      error: "Error al emitir la factura",
      detalles: error.message,
    });
  }
}

module.exports = { emitirFactura };

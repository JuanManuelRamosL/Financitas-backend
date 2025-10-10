const Afip = require("@afipsdk/afip.js");

const afip = new Afip({
  CUIT: process.env.AFIP_CUIT, // tu CUIT
  cert: process.env.AFIP_CERT_PATH, // ruta al .crt
  key: process.env.AFIP_KEY_PATH, // ruta al .key
  production: true, // true para producción, false para testing
});

async function emitirFactura(req, res) {
  try {
    const { docNro, importeNeto, importeIVA, tipo } = req.body;

    if (!docNro || !importeNeto || !importeIVA) {
      return res.status(400).json({
        error: "docNro, importeNeto e importeIVA son requeridos",
      });
    }

    const ptoVta = parseInt(process.env.AFIP_PTO_VTA || "1", 10);

    // tipo 1 = Factura A, 6 = Factura B, etc.
    const data = {
      CantReg: 1,
      PtoVta: ptoVta,
      CbteTipo: tipo || 6, // por defecto Factura B
      Concepto: 1,
      DocTipo: 80, // CUIT del cliente
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

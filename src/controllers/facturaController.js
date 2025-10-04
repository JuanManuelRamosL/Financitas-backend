const Afip = require("@afipsdk/afip.js");

async function emitirFactura(req, res) {
  try {
    const { cuitUsuario, docNro, importeNeto, importeIVA } = req.body;

    if (!cuitUsuario || !docNro || !importeNeto || !importeIVA) {
      return res
        .status(400)
        .json({
          error: "cuitUsuario, docNro, importeNeto y importeIVA son requeridos",
        });
    }

    // Inicializamos Afip con el CUIT del usuario
    const afip = new Afip({ CUIT: cuitUsuario });

    const data = {
      CantReg: 1,
      PtoVta: 1,
      CbteTipo: 1, // Factura A
      Concepto: 1, // Productos
      DocTipo: 80, // CUIT del cliente
      DocNro: docNro,
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
          Id: 5, // 21%
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
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al emitir la factura", detalles: error.message });
  }
}

module.exports = { emitirFactura };

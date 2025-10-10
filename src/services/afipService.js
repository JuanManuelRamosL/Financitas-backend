const Afip = require("@afipsdk/afip.js");
const path = require("path");

function getAfipForUser(user) {
  if (!user.cuit || !user.certPath || !user.keyPath || !user.puntoVenta) {
    throw new Error("Usuario no configurado para emitir facturas");
  }

  return new Afip({
    CUIT: user.cuit,
    cert: path.resolve(user.certPath),
    key: path.resolve(user.keyPath),
    production: false, // cambiar a true en producción
  });
}

/**
 * Genera comprobante electrónico para un usuario.
 * @param {object} user instancia de User con los campos correctos
 * @param {string|number} clientDocNumber - CUIT/DNI del cliente receptor
 * @param {number} amount - monto total incluyendo IVA si corresponde
 * @returns {object} respuesta de AFIP con CAE, etc.
 */
async function emitirComprobante(user, clientDocNumber, amount) {
  const afip = getAfipForUser(user);

  // decidir tipo de comprobante según reglas (simplificado)
  let CbteTipo = 11; // Factura C
  let DocTipo = 99;
  let docNum = 0;
  const strDoc = String(clientDocNumber);
  if (strDoc.length === 11) {
    DocTipo = 80;
    if (user.taxCategory === "responsable_inscripto") {
      CbteTipo = 1; // Factura A
    } else {
      CbteTipo = 6; // Factura B
    }
    docNum = Number(clientDocNumber);
  }

  // calcular ImpNeto, ImpIVA si Factura A/B
  let impNeto = amount;
  let impIVA = 0;
  if (CbteTipo === 1 || CbteTipo === 6) {
    // asumimos IVA 21%
    impNeto = parseFloat((amount / 1.21).toFixed(2));
    impIVA = parseFloat((amount - impNeto).toFixed(2));
  }

  const data = {
    CantReg: 1,
    PtoVta: user.puntoVenta,
    CbteTipo,
    Concepto: 1,
    DocTipo,
    DocNro: docNum,
    CbteDesde: 0,
    CbteHasta: 0,
    CbteFch: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
    ImpTotal: amount,
    ImpTotConc: 0,
    ImpNeto: impNeto,
    ImpOpEx: 0,
    ImpIVA: impIVA,
    ImpTrib: 0,
    MonId: "PES",
    MonCotiz: 1,
    Iva: impIVA > 0 ? [{ Id: 5, BaseImp: impNeto, Importe: impIVA }] : [],
  };

  const res = await afip.ElectronicBilling.createVoucher(data);
  return res;
}

module.exports = { emitirComprobante };

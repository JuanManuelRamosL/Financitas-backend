const User = require("../models/User");

async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name y email son requeridos" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const user = await User.create({ name, email });
    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const getPaidStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ paidThisMonth: user.paidThisMonth });
  } catch (error) {
    res.status(500).json({ message: "Error interno", error });
  }
};

// Actualizar pago del mes
const updatePaidStatus = async (req, res) => {
  const { id } = req.params;
  const { paidThisMonth } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.paidThisMonth = paidThisMonth;
    await user.save();

    res.json({
      message: "Estado de pago actualizado",
      paidThisMonth: user.paidThisMonth,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno", error });
  }
};

module.exports = { createUser, getPaidStatus, updatePaidStatus };

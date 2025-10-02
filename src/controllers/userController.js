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

module.exports = { createUser };

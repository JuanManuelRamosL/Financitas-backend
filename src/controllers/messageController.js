const { normalizeMessage } = require("../services/aiService");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const User = require("../models/User");

async function processMessage(req, res) {
  try {
    const { userId, message } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const normalized = await normalizeMessage(message);

    if (normalized.type === "expense") {
      const expense = await Expense.create({
        description: normalized.description,
        amount: normalized.amount,
        category: normalized.category,
        userId,
      });
      return res.json({ success: true, expense });
    }

    if (normalized.type === "income") {
      const income = await Income.create({
        source: normalized.source,
        amount: normalized.amount,
        userId,
      });
      return res.json({ success: true, income });
    }

    return res.status(400).json({ error: "Message not recognized" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { processMessage };

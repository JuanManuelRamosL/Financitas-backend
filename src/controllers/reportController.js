const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { Op } = require("sequelize");

async function monthlyReport(req, res) {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros (userId, month, year)" });
    }

    // Rango de fechas
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // último día del mes

    // Buscar gastos
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    // Buscar ingresos
    const incomes = await Income.findAll({
      where: {
        userId,
        date: { [Op.between]: [startDate, endDate] },
      },
    });

    // Totales
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
    const balance = totalIncomes - totalExpenses;

    return res.json({
      userId,
      month,
      year,
      totalExpenses,
      totalIncomes,
      balance,
      expenses,
      incomes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { monthlyReport };

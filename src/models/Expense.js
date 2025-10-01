const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

class Expense extends Model {}

Expense.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }, // 👈 nueva columna
  },
  { sequelize, modelName: "expense" }
);

Expense.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Expense, { foreignKey: "userId" });

module.exports = Expense;

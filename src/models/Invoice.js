const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Invoice = sequelize.define("Invoice", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  clientDocNumber: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  cae: { type: DataTypes.STRING },
  caeVto: { type: DataTypes.STRING },
  rawResponse: { type: DataTypes.TEXT },
});

Invoice.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Invoice, { foreignKey: "userId" });

module.exports = Invoice;

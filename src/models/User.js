const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  cuit: { type: DataTypes.STRING, allowNull: true, unique: true },
  puntoVenta: { type: DataTypes.INTEGER, allowNull: true },
  certPath: { type: DataTypes.STRING, allowNull: true },
  keyPath: { type: DataTypes.STRING, allowNull: true },
  taxCategory: { type: DataTypes.STRING, allowNull: true },
  paidThisMonth: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }, // nuevo campo
});

module.exports = User;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

class Income extends Model {}

Income.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }, // 👈 nueva columna
  },
  { sequelize, modelName: "income" }
);

Income.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Income, { foreignKey: "userId" });

module.exports = Income;

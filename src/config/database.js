const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 1111,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;

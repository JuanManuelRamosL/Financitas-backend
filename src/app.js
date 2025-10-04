const express = require("express");
const sequelize = require("./config/database");
const messageRoutes = require("./routes/messages");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");
const facturaRoutes = require("./routes/facturaRoutes");

const app = express();
app.use(express.json());

app.use("/messages", messageRoutes);
app.use("/reports", reportRoutes);
app.use("/users", userRoutes);
app.use("/facturas", facturaRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("DB synced");
});

module.exports = app;

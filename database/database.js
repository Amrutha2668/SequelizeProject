// eslint-disable-next-line no-undef
const { Sequelize } = require("sequelize");

// Access to Mysql server
let sequelize = new Sequelize("", "root", "root@123", {
  dialect: "mysql",
});

// Database creation
sequelize
  .query("CREATE DATABASE IF NOT EXISTS `Company`;")
  .then(() => console.log("Created Database"));

// Establishing connection with created db
sequelize = new Sequelize("Company", "root", "root@123", {
  host: "localhost",
  dialect: "mysql",
});

// eslint-disable-next-line no-undef
module.exports = sequelize;

// eslint-disable-next-line no-undef
const Sequelize = require("sequelize");
// eslint-disable-next-line no-undef
const sequelize = require("../database/database");

// creating table
const DataTable = sequelize.define("DataTable", {
  AUTHORIZED_CAP: Sequelize.DataTypes.BIGINT,
  DATE_OF_REGISTRATION: Sequelize.DataTypes.TEXT,
  PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN: Sequelize.DataTypes.TEXT,
});

// eslint-disable-next-line no-undef
module.exports = DataTable;

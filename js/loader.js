// eslint-disable-next-line no-undef
const sequelize = require("../database/database");
// eslint-disable-next-line no-undef
const DataTable = require("./table");
// eslint-disable-next-line no-undef
const csv = require("csv-parser");
const file_path = "C:/Users/Ammu/Downloads/Tripura.csv";
// eslint-disable-next-line no-undef
const fs = require("fs");

loader();

// Creating table
function loader() {
  async function createTable() {
    await sequelize.sync().catch((err) => console.log(err));
  }

  createTable();
  // Creating file reading stream to read csv data
  const csvStream = fs.createReadStream(file_path).pipe(csv());

  let records = [];

  // Fetching only the required field and storing it in an array
  csvStream.on("data", (row) => {
    let year = row.DATE_OF_REGISTRATION.includes("NA")
      ? "00"
      : row.DATE_OF_REGISTRATION;
    year = parseInt(
      parseInt(year.slice(-2)) <= 20
        ? "20" + year.slice(-2)
        : "19" + year.slice(-2)
    );

    records.push({
      AUTHORIZED_CAP: parseFloat(row.AUTHORIZED_CAP),
      DATE_OF_REGISTRATION: year,
      PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN:
        row.PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN,
    });
  });

  // Inserting data at the end of database
  csvStream.on("end", () => {
    bulkLoad(records);
  });

  async function bulkLoad(records) {
    await DataTable.bulkCreate(records)
      .then(() => console.log("Data stored into table"))
      .catch("failure");
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  loader: loader,
};

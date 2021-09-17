// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const { Op } = require("sequelize");
// eslint-disable-next-line no-undef
const sequelize = require("../database/database");
// eslint-disable-next-line no-undef
const DataTable = require("./table");
// Json file path
const JSON_OUTPUT_FILE_PATH1 = "../jsonData/jOne.json";
const JSON_OUTPUT_FILE_PATH2 = "../jsonData/jTwo.json";
const JSON_OUTPUT_FILE_PATH3 = "../jsonData/jThree.json";
const JSON_OUTPUT_FILE_PATH4 = "../jsonData/jFour.json";

let jsonDataArr = [];

function analyzer() {
  // 1st object to store capital range
  let authorizedCapital = {
    ["<=1L"]: 0,
    ["1L to 10L"]: 0,
    ["10L to 1Cr"]: 0,
    ["1Cr to 10Cr"]: 0,
    [">10Cr"]: 0,
  };

  // 2nd object to store no. of registrations per year
  let registeredYears = {};

  // 3rd Object to store principal business activity count
  let principalActivity = {};

  // 4th Object to principal business activity count in each year
  let companyGrouped = {};

  function analyze() {
     sequelize
      //  performs the defined operations on the database
      .sync();
    // 1st solution, fetching authorized capitals
    const authorizedCap = DataTable.findAll({
      attributes: [
        "AUTHORIZED_CAP",
        [sequelize.fn("count", sequelize.col("AUTHORIZED_CAP")), "count"],
      ],
      group: ["AUTHORIZED_CAP"],
      raw: true,
      order: sequelize.literal("count DESC"),
    });
    return authorizedCap;
  }
  async function compute1() {
    const capitals = await analyze();
    console.log(capitals);
    for (let data in capitals) {
      // fetching the data fields value from the computed result.
      let capital = capitals[data].AUTHORIZED_CAP;
      let count = capitals[data].count;

      // Inserting data into object upon checking the data range
      if (capital <= 100000) authorizedCapital["<=1L"] += count;
      else if (capital >= 100000 && capital <= 1000000)
        authorizedCapital["1L to 10L"] += count;
      else if (capital >= 1000000 && capital <= 10000000)
        authorizedCapital["10L to 1Cr"] += count;
      else if (capital >= 10000000 && capital <= 100000000)
        authorizedCapital["1Cr to 10Cr"] += count;
      else if (capital >= 10000000) authorizedCapital[">10Cr"] += count;
    }
    jsonDataArr.push(authorizedCapital, JSON_OUTPUT_FILE_PATH1);

    // 2nd solution fetching no. of registrations per year
    const registrations = DataTable.findAll({
      attributes: [
        "DATE_OF_REGISTRATION",
        [sequelize.fn("count", sequelize.col("DATE_OF_REGISTRATION")), "count"],
      ],
      where: {
        ["DATE_OF_REGISTRATION"]: {
          [Op.between]: [2000, 2019],
        },
      },
      group: ["DATE_OF_REGISTRATION"],
      raw: true,
      order: sequelize.literal("DATE_OF_REGISTRATION "),
    });
    return registrations;
  }
  async function compute2() {
    const years = await compute1();
    console.log(years);

    // fetching the data fields value from the computed result.
    for (let record in years) {
      let year = years[record].DATE_OF_REGISTRATION;
      registeredYears[year] = years[record].count;
    }
    jsonDataArr.push(registeredYears, JSON_OUTPUT_FILE_PATH2);

    // 3rd solution pba in the year 2015
    const pba = DataTable.findAll({
      attributes: [
        "PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN",
        [
          sequelize.fn(
            "count",
            sequelize.col("PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN")
          ),
          "count",
        ],
      ],
      where: {
        ["DATE_OF_REGISTRATION"]: [2015],
      },
      group: ["PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN"],
      raw: true,
      order: sequelize.literal("count desc"),
    });
    return pba;
  }
  async function compute3() {
    const pbAct = await compute2();
    console.log(pbAct);

    // fetching the data fields value from the computed result.
    for (let activity in pbAct) {
      principalActivity[
        pbAct[activity].PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN
      ] = pbAct[activity].count;
    }
    jsonDataArr.push(principalActivity, JSON_OUTPUT_FILE_PATH3);

    // 4th solution, no. of pba registrations per year
    const pba = DataTable.findAll({
      attributes: [
        "PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN",
        "DATE_OF_REGISTRATION",
        [
          sequelize.fn(
            "count",
            sequelize.col("PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN")
          ),
          "count",
        ],
      ],
      where: {
        ["DATE_OF_REGISTRATION"]: {
          [Op.between]: [2000, 2019],
        },
      },
      group: ["PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN", "DATE_OF_REGISTRATION"],
      raw: true,
      order: sequelize.literal("DATE_OF_REGISTRATION"),
    });
    return pba;
  }
  async function compute4() {
    const pbaPerYear = await compute3();
    console.log(pbaPerYear);

    // fetching the data fields value from the computed result.
    for (let entry in pbaPerYear) {
      const year = pbaPerYear[entry].DATE_OF_REGISTRATION;
      let total = pbaPerYear[entry].count;

      // checking if year nested array is present
      if (year in companyGrouped == false) {
        companyGrouped[year] = {};
        companyGrouped[year][
          pbaPerYear[entry].PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN
        ] = total;
      } else {
        companyGrouped[year][
          pbaPerYear[entry].PRINCIPAL_BUSINESS_ACTIVITY_AS_PER_CIN
        ] = total;
      }
    }
    jsonDataArr.push(companyGrouped, JSON_OUTPUT_FILE_PATH4);

    // This for my reference to check objects
    console.log(authorizedCapital);
    console.log(registeredYears);
    console.log(principalActivity);
    console.log(companyGrouped);
  }
  
  analyze()
  .then(compute4)
  .then(() => save(jsonDataArr))
  .then(() => console.log("json files are generated"))
  .catch((err) => console.log(err));
}

// Converting object's to json file's
function save(objectAndFile) {
  let jsonString;
  let jsonData;

  for (let index = 0; index <= objectAndFile.length; index++) {
    let obj = objectAndFile[index];
    // let str = objectAndFile[index]+"";
    jsonData = {
      // str : obj,
      Object: obj,
    };
    jsonString = JSON.stringify(jsonData);
    let path = objectAndFile[index + 1] + "";
    fs.writeFile(path, jsonString, "utf-8", (err) => {
      if (err) {
        console.log(err);
      }
    });
    index += 1;
  }
}

analyzer();

// eslint-disable-next-line no-undef
module.exports = {
  analyzer: analyzer,
};

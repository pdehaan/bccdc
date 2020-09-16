const axios = require("axios");
const chalk = require("chalk");
const parse = require("csv-parse/lib/sync");

module.exports = {
  fetchData,
  dataToString
};

async function fetchData(days=Number.MAX_SAFE_INTEGER) {
  const uri = "http://www.bccdc.ca/Health-Info-Site/Documents/BCCDC_COVID19_Dashboard_Case_Details.csv";
  const cases = await fetchCSV(uri);
  return aggregateData(cases).slice(-Math.abs(days));
}

async function fetchCSV(uri) {
  const res = await axios.get(uri);
  return parse(res.data, { columns: true, skipEmptyLines: true });
}

function aggregateData(cases = []) {
  const results = new Map();

  let cumulative = 0;
  for (const $case of cases) {
    const key = $case.Reported_Date;
    let res = results.get(key) || { date: key, daily: 0, cumulative: 0, highscore: false };
    cumulative += 1;
    res.daily += 1;
    res.cumulative = cumulative;
    results.set(key, res);
  }

  let highscore = 0;
  const values = [...results.values()];
  return values.map((res) => {
    if (res.daily > highscore) {
      res.highscore = true;
      highscore = res.daily;
    }
    return res;
  });
}

function dataToString(data) {
  const color = data.highscore ? chalk.red : (txt) => txt;
  return (
    color(`${data.date}\t${data.daily}\t${data.cumulative}\t${data.highscore ? "Y" : ""}`)
  );
}

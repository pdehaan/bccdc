#!/usr/bin/env node

const chalk = require("chalk");
const lib = require("./lib");

const days = process.env.DAYS || 21;

main(days);

async function main(days = 21) {
  const res = await lib.fetchData(days);
  const durTotals = res.reduce((acc, day) => (acc += day.daily), 0);
  const cumulative = res[res.length - 1].cumulative;
  const cumulativePct = Number((durTotals / cumulative) * 100).toFixed(1) + "%";
  const summary = [`TOTAL (${res.length})`, durTotals.toLocaleString(), cumulative.toLocaleString(), cumulativePct];
  const data = res.map((row) => lib.dataToString(row));
  // HEADER
  data.unshift(chalk.bold.underline("DATE\t\tCASES\tTOTAL\tRECORD"));
  // FOOTER
  data.push(chalk.bold(summary.join("\t")));

  console.log(data.join("\n"));
}

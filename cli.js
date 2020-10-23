#!/usr/bin/env node

const lib = require("./lib");

const days = process.env.DAYS || 21;

main(days);

async function main(days = 21) {
  const res = await lib.fetchData(days);
  let durTotals = res.reduce((acc, day) => (acc += day.daily), 0);
  let cumulative = res[res.length - 1].cumulative;
  const cumulativePct = Number((durTotals / cumulative) * 100).toFixed(1) + "%";
  durTotals = durTotals.toLocaleString();
  cumulative = cumulative.toLocaleString();
  const data = res.map((row) => lib.dataToString(row));
  data.unshift("DATE\t\tCASES\tTOTAL\tRECORD");
  data.push(
    `TOTAL (${res.length})\t${durTotals}\t${cumulative}\t${cumulativePct}`
  );
  console.log(data.join("\n"));
}

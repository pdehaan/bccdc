#!/usr/bin/env node

const lib = require("./lib");

main(21);

async function main(days=21) {
  const res = await lib.fetchData(days);
  const durTotals = res.reduce((acc, day) => acc += day.daily, 0);
  const cumulative = res[res.length - 1].cumulative;
  const cumulativePct = durTotals / cumulative * 100;

  console.log("DATE\t\tDAILY\tTOTAL\tRECORD");
  res.forEach((data) => console.log(lib.dataToString(data)));
  console.log(`TOTAL (${res.length})\t${durTotals}\t${cumulative}\t${(cumulativePct).toFixed(1)}%`);
}

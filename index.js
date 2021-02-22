const fs = require('fs');
const csv = require('csv-parser');
// const { info } = require('console');
const info = [];
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', function (row) {
    info.push(row.Firstname);
  })
  .on('end', function () {
    console.log(info);
  });
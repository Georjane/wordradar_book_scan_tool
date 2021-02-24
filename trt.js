const fs = require('fs');
const csv = require('csv-parser');

const findMeaningAndDescription = (root_id) => {
let arrRootIdMeaningDesc = []
fs.createReadStream('roots.csv')
    .pipe(csv())
    .on('data', function (row) {
      if (row.root_id == root_id) {
        arrRootIdMeaningDesc.push(row.root_id, row.description, row.Meaning)
      }
    })
    .on('end', function () {
      console.log(arrRootIdMeaningDesc);
    });  
  }


  // arr = [15, 6, 34]
  // arr.forEach(element => {
  //   findMeaningAndDescription(element) 
  // });
  //  1085, [ '1085', 'e, ex', 'out of, from, up, away, fully' ]
  // 445, [ '445', 'labor', 'work, toil' ]
  // 1103  [ '1103', 'ate', 'full of, quality of, state of, having' ]
let myVar = 1085
  findMeaningAndDescription(myVar)
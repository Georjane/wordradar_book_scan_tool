const fs = require('fs');
const csv = require('csv-parser');

const info = [];
const string = ['genuine', 'yesooo', 'one', 'elaborate', '32', 'yes'];
const wordsNotFound = [];

fs.createReadStream('words.csv')
  .pipe(csv())
  .on('data', function (row) {
    info.push(row.word);
  })
  .on('end', function () {
    const numberOfWordsFound = containsWord(string, info);
    const percentageMatch = calculatePercentage(string, numberOfWordsFound)
  console.log(percentageMatch);
  console.log(wordsNotFound);
  });

const containsWord = (words, dictionary) => {
  let numberOfWordsFound = 0;
  words.forEach(word => {
    if (dictionary.includes(word)) {
      numberOfWordsFound += 1
    } else {
      wordsNotFound.push(word)
    }
  });
  return numberOfWordsFound
}

const calculatePercentage = (words, numberOfWordsFound) => {
  return (numberOfWordsFound/words.length)*100
}



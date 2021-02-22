const fs = require('fs');
const csv = require('csv-parser');

const dictionary = [];
const string = ['genuine', 'yesooo', 'one', 'elaborate', 'yes', 'abandoning', 'elaborated'];
const wordsNotFound = [];

fs.createReadStream('words.csv')
  .pipe(csv())
  .on('data', function (row) {
    dictionary.push(row.word);
  })
  .on('end', function () {
    const numberOfWordsFound = containsWord(string, dictionary);
    const percentageMatch = calculatePercentage(string, numberOfWordsFound)
    console.log('>>>>>>>>>>>>>> Percentage Match is ' + percentageMatch );
    partlyMatchedWords(wordsNotFound, dictionary)
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

const partlyMatchedWords = (words, dictionary) => {
  let hashOfWords = {};
  words.forEach(parentWord => {
    dictionary.forEach(childWord => {
      let regexChildWord = new RegExp(escapeRegExp(childWord));
      if (regexChildWord.test(parentWord)) {
        hashOfWords[regexChildWord] = parentWord
      }
      return hashOfWords
    });
  });
  console.log(hashOfWords);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

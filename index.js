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
  let subhash = {}
    dictionary.forEach(childWord => {
      let regexChildWord = new RegExp(escapeRegExp(childWord));
      if (regexChildWord.test(parentWord)) {
        subhash[childWord] = wordPercentageMatch(childWord, parentWord)
      }

      return hashOfWords
    });
    hashOfWords[parentWord] = subhash
  });
  console.log(hashOfWords);
}

const wordPercentageMatch = (childWord, parentWord) => {
  return ((childWord.length/parentWord.length)*100 + '%')
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


let array = [
  { so: 'yesooo' },
  { yes: 'yesooo' },
  { '': 'elaborated' },
  { s: 'yesooo' },
  { band: 'abandoning' },
  { and: 'abandoning' },
  { in: 'abandoning' },
  { do: 'abandoning' },
  { on: 'abandoning' },
  { abandon: 'abandoning' },
  { don: 'abandoning' },
  { ab: 'elaborated' },
  { elaborate: 'elaborated' },
  { ate: 'elaborated' },
  { labor: 'elaborated' },
  { or: 'elaborated' },
  { at: 'elaborated' },
  { rate: 'elaborated' },
  { lab: 'elaborated' },
  { labo: 'elaborated' },
  { orate: 'elaborated' }
]

let object = {
  so: 'yesooo',
  yes: 'yesooo',
  '': 'elaborated',
  s: 'yesooo',
  band: 'abandoning',
  and: 'abandoning',
  in: 'abandoning',
  do: 'abandoning',
  on: 'abandoning',
  abandon: 'abandoning',
  don: 'abandoning',
  ab: 'elaborated',
  elaborate: 'elaborated',
  ate: 'elaborated',
  labor: 'elaborated',
  or: 'elaborated',
  at: 'elaborated',
  rate: 'elaborated',
  lab: 'elaborated',
  labo: 'elaborated',
  orate: 'elaborated'
}


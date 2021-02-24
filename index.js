const fs = require('fs');
const csv = require('csv-parser');
const { count } = require('console');

wordAndId = {}
// abandon: {
  // word: abandon,
  // word_id: 3444
// }
const dictionary = [];
const arrayOfWordIds = [];
const words = ['genuine', 'yesooo', 'one', 'elaborate', 'yes', 'abandoning', 'elaborated'];
const wordsNotFound = [];
const wordsNotFoundAndId = {};

fs.createReadStream('words.csv')
  .pipe(csv())
  .on('data', function (row) {
    let eachWord = {};
    eachWord['word'] = row.word;
    eachWord['word_id'] = row.word_id;
    wordAndId[row.word] = eachWord
    // dictionary.push(row.word);
  })
  .on('end', function () {
    for (const word in wordAndId) {
      dictionary.push(wordAndId[word]['word'])
      arrayOfWordIds.push(wordAndId[word]['word_id'])
    }

    const numberOfWordsFound = containsWord(words, dictionary);
    const percentageMatch = calculatePercentage(words, numberOfWordsFound)
    // console.log('>>>>>>>>>>>>>> Percentage Match is ' + percentageMatch + '%');
    const hashOfWords = partlyMatchedWords(wordsNotFound, dictionary)
    // abandoning = {
      // abandon: 70%
    // }

		let results = wordsWithHighestPercentMatch(hashOfWords, arrayOfWordIds)
    // abandoning = {
      // abandon: {
            // percent: 70,
            // word_id: 344,
            // root_id: 8877
      // }
    // }
		// let results = findWordId(hashOfWords)

    // console.log(results);
		// res.render('resultspage', { data: results, percent: percentageMatch });
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
    return Math.round((numberOfWordsFound/words.length)*100)
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
      });
      hashOfWords[parentWord] = subhash
    });
    return hashOfWords
  }
  
  const wordPercentageMatch = (childWord, parentWord) => {
    // return (Math.round((childWord.length/parentWord.length)*100) + '%')
    return (Math.round((childWord.length/parentWord.length)*100))
  }
  
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  
  const findMaxPercentageMatch = (object) => {
    let percentValuesArray = Object.values(object);
    return Math.max(...percentValuesArray);
  }
  
  const wordsWithHighestPercentMatch = (hashOfWords, arrayOfWordIds) => {
    let filteredUnfoundWords = {}
    // console.log(arrayOfWordIds);
    for (const key in hashOfWords) {
      let subdata = {}
      let max = findMaxPercentageMatch(hashOfWords[key])
      let maxKey = getKeyByValue(hashOfWords[key], max)
      subdata[maxKey] = max;
      subdata['word_id'] = findWordId(maxKey)
      filteredUnfoundWords[key] = subdata
    }
    findRootId(filteredUnfoundWords)
  }

   const findWordId = (maxKey) => {
    for (const word in wordAndId) {
      if (maxKey == wordAndId[word]['word']) {
        return wordAndId[word]['word_id']
      }
    }
  }

  const findRootId = (filteredUnfoundWords) => {

    for (const word in filteredUnfoundWords) {
      let root_ids = [];
      fs.createReadStream('word_roots_map.csv')
        .pipe(csv())
        .on('data', function (row) {
          if (row.word_id == filteredUnfoundWords[word]['word_id']) {
            root_ids.push(row.root_id)
          }
        })
        .on('end', function () {
          finalRootIds(root_ids, filteredUnfoundWords)
          root_ids.forEach(root_id => {            
            findMeaningAndDescription(root_id, filteredUnfoundWords)
          });
          // results()
        });
    }
  }

  const findMeaningAndDescription = (root_id, filteredUnfoundWords) => {
    let arrRootIdMeaningDesc = []
    fs.createReadStream('roots.csv')
        .pipe(csv())
        .on('data', function (row) {
          if (row.root_id == root_id) {
            arrRootIdMeaningDesc.push(row.root_id, row.description, row.Meaning)
          }
        })
        .on('end', function () {
            console.log(filteredUnfoundWords);
          console.log(arrRootIdMeaningDesc);
        });  
      }

  const finalRootIds = (root_ids, filteredUnfoundWords) => {
    let counter = 0;
            for (const word in filteredUnfoundWords) {
              filteredUnfoundWords[word]['root_id'] = root_ids[counter]
              // filteredUnfoundWords[word]['meaning'] = meanings[counter]
              counter += 1
            }
            // console.log(filteredUnfoundWords); 
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
 
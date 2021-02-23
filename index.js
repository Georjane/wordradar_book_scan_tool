const fs = require('fs');
const csv = require('csv-parser');

// const dictionary = {};
// wordProperties = {};
// rootProperties = {};
const dictionary = [];
const words = ['genuine', 'yesooo', 'one', 'elaborate', 'yes', 'abandoning', 'elaborated'];
const wordsNotFound = [];
const wordsNotFoundAndId = {};

fs.createReadStream('words.csv')
  .pipe(csv())
  .on('data', function (row) {
    dictionary.push(row.word);
  })
  .on('end', function () {
    const numberOfWordsFound = containsWord(words, dictionary);
    const percentageMatch = calculatePercentage(words, numberOfWordsFound)
    console.log('>>>>>>>>>>>>>> Percentage Match is ' + percentageMatch + '%');
    const hashOfWords = partlyMatchedWords(wordsNotFound, dictionary)
		let results = wordsWithHighestPercentMatch(hashOfWords)
    console.log(results);
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
  
  const wordsWithHighestPercentMatch = (hashOfWords) => {
    let filteredUnfoundWords = {}
    for (const key in hashOfWords) {
      let subdata = {}
      let max = findMaxPercentageMatch(hashOfWords[key])
      let maxKey = getKeyByValue(hashOfWords[key], max)
      subdata[maxKey] = max;
      subdata['root_id'] = findWordId(maxKey);
      subdata['meaning'] = 'meaning';
      subdata['description'] = 'description';
      filteredUnfoundWords[key] = subdata
    }
    return filteredUnfoundWords;
  }
  
  const findWordId = (maxKey) => {
    let keyy = 12;
    let word_ids = [];
    fs.createReadStream('words.csv')
      .pipe(csv())
      .on('data', function (row) {
        // if (row.word == maxKey) {
        //   word_ids.push(row.word_id)
        // }
        keyy = 20;
      })
      .on('end', function () {
        // word_ids.forEach(word_id => {
        //   findRootId(word_id)           
        // });
        return keyy
      });
      return keyy;
  }
  

  const findRootId = (word_id) => {
    let root_id;
    fs.createReadStream('word_roots_map.csv')
      .pipe(csv())
      .on('data', function (row) {
        if (row.word_id == word_id) {
        console.log(word_id);
          root_id = row.root_id
        }
      })
      .on('end', function () {
        console.log(root_id); 
      });
  }
  
  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
 
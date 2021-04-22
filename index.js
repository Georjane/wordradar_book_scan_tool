const fs = require('fs');
const csv = require('csv-parser');
const { count } = require('console');

const wordAndId = {}
const dictionary = [];
const arrayOfWordIds = [];
const words = ['genuine', 'yesooo', 'one', 'elaborate', 'yes', 'abandoning', 'elaborated', 'molecules', 'chimpanzees', 'sadism', 'adversaries', 'anatomies'];
const wordsNotFound = [];
const wordsNotFoundAndId = {};
let resultsObject = {};

function commonPrefixUtil(str1,str2) {
  let  result = "";
  let n1 = str1.length, n2 = str2.length;
  for (let i = 0, j = 0; i <= n1 - 1 && j <= n2 - 1; i++, j++) {
    if (str1[i] != str2[j]) {
      break;
    }
    result += str1[i];
  }    
  return (result);
}

function longest_common_starting_substring(arr1){
  var arr= arr1.concat().sort(),
  a1= arr[0], a2= arr[arr.length-1], L= a1.length, i= 0;
  while(i< L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
}

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
    const wordsAndMatchedWordsAlgorithm1 = partlyMatchedWordsAlgorithm1(words, dictionary)
    const wordsAndMatchedWordsLongestCommonPrefix = partlyMatchedWordsLongestCommonPrefix(words, dictionary)
    const wordsAndMatchedWordsLongestCommonStartingSubstring = partlyMatchedWordsLongestCommonStartingSubstring(words, dictionary)
    
    console.log(wordsAndMatchedWordsAlgorithm1);
    console.log(wordsAndMatchedWordsLongestCommonPrefix);
    console.log(wordsAndMatchedWordsLongestCommonStartingSubstring);
		// let results = wordsWithHighestPercentMatch(hashOfWords, arrayOfWordIds)
  });

  const partlyMatchedWordsLongestCommonStartingSubstring = (words, dictionary) => {
    const newunfoundWordsWithPartlyMatchedWords = {};    
    words.map(word => {
      const subhash = {};
      dictionary.map(dictionaryword => {
        let subobject = {}
        let arr1 = [word, dictionaryword]
        if (longest_common_starting_substring(arr1).length > (word.length/2)) {
          subobject['word'] = dictionaryword
          if (word.length > dictionaryword.length) {
            subobject['percent'] = wordPercentageMatch(commonPrefixUtil(word, dictionaryword), word)
          }else{
            subobject['percent'] = wordPercentageMatch(commonPrefixUtil(word, dictionaryword), dictionaryword)
          }
          subhash[dictionaryword] = subobject
      }
      subhash 
      })
      newunfoundWordsWithPartlyMatchedWords[word] = subhash;
    })
    return (newunfoundWordsWithPartlyMatchedWords);
  };

  // this algorith is for matches whose wordlength is greater than 2 and percentage match is more than 30%
  const partlyMatchedWordsLongestCommonPrefix = (words, dictionary) => {
    const unfoundWordsWithPartlyMatchedWords = {};
    words.map(parentWord => {
      const subhash = {};
      dictionary.map(childWord => {
        if(commonPrefixUtil(parentWord, childWord).length > 2) {
          let subobject = {}
          subobject['word'] = childWord
          if (parentWord.length > childWord.length) {
            subobject['percent'] = wordPercentageMatch(commonPrefixUtil(parentWord, childWord), parentWord)
          }else{
            subobject['percent'] = wordPercentageMatch(commonPrefixUtil(parentWord, childWord), childWord)
          }
          // subobject['percent'] = wordPercentageMatch(commonPrefixUtil(parentWord, childWord), parentWord)
          subhash[childWord] = subobject
        }
        subhash
      });
      unfoundWordsWithPartlyMatchedWords[parentWord] = subhash;
    });
    for (const key in unfoundWordsWithPartlyMatchedWords) {    
      for (const key1 in unfoundWordsWithPartlyMatchedWords[key]) {
        if ((unfoundWordsWithPartlyMatchedWords[key][key1].percent) < 30) {
          delete(unfoundWordsWithPartlyMatchedWords[key][key1])
        }
      }
    }
    // console.log(unfoundWordsWithPartlyMatchedWords);
    return (unfoundWordsWithPartlyMatchedWords);
  };


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
  
  const partlyMatchedWordsAlgorithm1 = (words, dictionary) => {
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
  
  const wordPercentageMatch = (word, parent) => (Math.round((word.length / parent.length) * 100));
  
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
              counter += 1
            }
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
 
   let X, Y;
  //  let result = [];
  //   function lcs(i, j, count)
  //   {      
  //       if (i == 0 || j == 0) //initially if  the one word has lenght 0, then there is no match
  //           return count;     
  //       if (X[i - 1] == Y[j - 1]) { // meaning i starts from 1 which is the length of the word but the 
  //                                   // corresponding letter is of index i-1, so X(i-1) 
  //                                   // so if X(i-1) == Y(j-1), then we move to lcs(0, 0, 1)
  //                                   // count = 1
  //                                   // max(1, max(lcs(1, 0, 0) and lcs(0, 1, 0)))
  //           count = lcs(i - 1, j - 1, count + 1);
  //           result.push(lcs(i - 1, j - 1, count + 1))
  //       }
  //       count = Math.max(count,
  //                   Math.max(lcs(i, j - 1, 0),
  //                       lcs(i - 1, j, 0)));
  //       return count;
  //   }     
    let n, m;  
    X = "abcdxyz";
    Y = "xyzabcd";  
    n = X.length;
    m = Y.length;
    const findCommon = (str1 = '', str2 = '') => {
      const common = Object.create(null);
      let i, j, part;
      for (i = 0; i < str1.length - 1; i++) {
         for (j = i + 1; j <= str1.length; j++) {
            part = str1.slice(i, j);
            if (str2.indexOf(part) !== (0 - 1)) {
               common[part] = true;
            }
         }
      }
      const commonEl = Object.keys(common);
      return commonEl;
   };

   function longest_common_starting_substring(arr1){
    var arr= arr1.concat().sort(),
    a1= arr[0], a2= arr[arr.length-1], L= a1.length, i= 0;
    while(i< L && a1.charAt(i)=== a2.charAt(i)) i++;
    return a1.substring(0, i);
    }
    
    console.log(longest_common_starting_substring(['sadism', 'sadistic'])); 
   console.log(findCommon('adversary', 'adverseries'));
    // console.log(lcs(n, m, 0));

    
app.get('/testing', (req, res) => {

  const wordAndId = {}
  const dictionary = [];
  const arrayOfWordIds = [];
  const words = ['domed','genuine', 'faced', 'elaborate', 'yes', 'abandoning', 'elaborated', 'molecules', 'chimpanzees', 'sadism', 'adversaries', 'anatomies'];
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
  
  fs.createReadStream('csvfiles/_words.csv')
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
      
      const scanData = JSON.stringify(wordsAndMatchedWordsLongestCommonStartingSubstring)
      fs.writeFile('scans/testing2.json', scanData, (err) => {
        if (err) {
          throw err;
        }
      });
      fs.readFile(`scans/testing2.json`, 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }
        res.render('testing', { data: data });
      });
  
      // console.log(wordsAndMatchedWordsAlgorithm1);
      // console.log(wordsAndMatchedWordsLongestCommonPrefix);
      // console.log(wordsAndMatchedWordsLongestCommonStartingSubstring);
      // // let results = wordsWithHighestPercentMatch(hashOfWords, arrayOfWordIds)
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
  
  });
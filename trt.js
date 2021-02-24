const words = {
  'abandon1': {
    'word': 'abandon11',
    'word_id': 3444
  },
  'abandon2': {
    'word': 'abandon12',
    'word_id': 3444
  },
  'abandon3': {
    'word': 'abandon13',
    'word_id': 3444
  },
  'abandon4': {
    'word': 'abandon14',
    'word_id': 3444
  },
  'abandon5': {
    'word': 'abandon15',
    'word_id': 3444
  }
}
let dic = []
for (const key in words) {
  dic.push(words[key]['word'])
  // console.log(words[key]['word']);
}
// console.log(words['abandon1']['word1']);
// console.log(Object.keys(words)[0]);
console.log(dic);
console.log(words);
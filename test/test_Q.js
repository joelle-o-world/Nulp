const Q = require("../src/Q.js")
const getRandomWords = require("../src/getRandomWords.js")

var myQ = new Q("_adj")
console.log(myQ)
var thing = myQ.rollMany(10).then(function(result) {
  console.log(result);
})

/*getRandomWords(50).then(function(words) {
  console.log(words)
})
*/

const Q = require("./Q.js")

function getRandomWords(n) {
  return new Q().rollMany(n)
}
module.exports = getRandomWords

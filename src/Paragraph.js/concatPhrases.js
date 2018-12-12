
var database = require("../sqlResources.js");
const parseText = require("../parseText")
const Word = require("../Word.js")

async function concatPhrases() {
  console.log("calling concatPhrases")
  for(var i=0; i<this.bits.length; i++) {
    if(this.bits[i].isWord && this.bits[i+1]) {

      var word = this.bits[i]
      console.log(word)
      var possiblePhrases = (await getPhraseCompletions(word.w)).sort((a,b) => {
        return b.length - a.length
      })
      console.log(possiblePhrases)


      for(var j in possiblePhrases) {
        var phrase = parseText(possiblePhrases[j])
        for(var k=0; k<phrase.length; k++) {
          if(this.bits[i+k].str != phrase[k])
            break;
        }

        if(k == phrase.length) {
          this.bits.splice(i, phrase.length, new Word(possiblePhrases[j]))
          this.bits[i].phrase = true
          break;
        }
      }
    }
  }
  return this
}
module.exports = concatPhrases


async function getPhraseCompletions(w) {
  var q = "SELECT word FROM words WHERE word LIKE " + database.escape(w + ' %')
  var response = await database.query(q)
  return response.results.map((row) => {
    return row.word
  })
}

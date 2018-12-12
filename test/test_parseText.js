const argv = require("minimist")(process.argv.slice(2))

const parseText = require("../src/parseText.js")

var text = argv._[0] || "Colourless green ideas sleep furiously."
var parsed = parseText(text)

console.log(parsed)

for(var i in parsed) {
  console.log(parsed[i], parseText.isWord(parsed[i]) ? "is a word" : "is not a word")
}

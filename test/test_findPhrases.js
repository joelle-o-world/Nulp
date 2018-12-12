const argv = require("minimist")(process.argv.slice(2))

const parseText = require("../src/parseText.js")
const Paragraph = require("../src/Paragraph.js")
const getCuttings = require("../src/getCuttings.js")

getCuttings().then(function(cuttings) {
  console.log(cuttings)
  var para = new Paragraph(cuttings[0])
  console.log(para)
  return para.concatPhrases()
}).then(function(para) {
  console.log(para)
}).catch((e) => {
  console.error(e)
})

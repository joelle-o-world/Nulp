const Paragraph = require("./Paragraph");
var argv = require("minimist")(process.argv.slice(2));
const logbook = require("../logbook.js");
const getCuttings = require("./getCuttings.js");

var qstrings = [
  "Take a shit near the _noun_place",
  "Dance _noun",
  "Strip _advb",
  "The LORD redeemeth the _advb of his _noun: and none of them that trust in him shall be desolate",
  "The _noun of _noun"
]



var txt = qstrings[Math.floor(Math.random()*qstrings.length)]

txt = new Paragraph(txt);

txt.rollQs().then(function(res) {
  var str = res.print;
  console.log("\n\n" + str+"\n\n");
  logbook(str)
});

getCuttings("bible", 1).then(function(cuttings) {
  return new Paragraph(cuttings[0]).analyse();
}).then(function(tx) {
  tx.qify()
  return tx.rollQs();
}).then(function(tx) {
  console.log(tx.print);
  logbook(tx.print)
})

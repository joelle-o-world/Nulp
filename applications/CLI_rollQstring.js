var Paragraph = require("./Paragraph.js");
var logbook = require("../logbook.js")
var argv = require("minimist")(process.argv.slice(2));
const Promise = require("promise");

var txt = argv._[0] || "^ _intj , you need to enter some text as a command line argument, you _adj _noun !";
var n = argv.n || 1;

var promises = [];
console.log("\n\n\n")
for(var i=0; i<n; i++) {
  promises.push(new Paragraph(txt).rollQs().then(function(text) {
    console.log(text.print)
  }))
}
console.log("\n\n");

Promise.all(promises).then(function(txts) {
  for(var i in txts)
    txts[i] = txts[i].print;
  //console.log("\n\n", txts.join("\n"), "\n\n");
  console.log("\n\n");
  logbook(txts.join("\n"));
})

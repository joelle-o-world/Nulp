const Chomsky = require("../src/Chomsky.js")

var a = Chomsky.fromFile("resources/grammars/Nihongo.grammar").then(function(grammar) {

  var instruction = grammar.replace("_example")
  console.log("\n\n", instruction, "\n\n")
})

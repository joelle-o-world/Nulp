const fs = require("fs").promises
const Paragraph = require("./Paragraph.js")
const Word = require("./Word.js")

function Chomsky() {
  this.classes = {}
}
module.exports = Chomsky

Chomsky.fromFile = async function(path) {
  var data = await fs.readFile(path, "utf-8")

  return Chomsky.parseGrammarFile(data)
}

Chomsky.parseGrammarFile = function(str) {
  var grammar = new Chomsky()
  var lines = str.split("\n")

  var currentClass = ""

  for(var i in lines) {
    var line = lines[i]

    if(line == "")
      continue;


    if(line.charAt(0) == "+") {
      while(line[0] == "+" || line[0] == " ")
        line = line.slice(1)
      grammar.classes[currentClass].push(line)
    } else {
      currentClass = line
      if(!grammar.classes[currentClass])
        grammar.classes[currentClass] = []
    }
  }

  return grammar
}

Chomsky.prototype.replace = function(str) {
  var para = new Paragraph(str)

  for(var i in para.bits)
    if(para.bits[i].isQ){
      var searchTerm = para.bits[i].args._[0]
      if(!searchTerm)
        continue

      var options = this.classes[searchTerm]
      var option = options[Math.floor(Math.random()*options.length)]

      para.bits[i] = new Word(this.replace(option))
    }

  return para.print
}

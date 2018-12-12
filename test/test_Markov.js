const Markov = require("../src/Markov.js")
const getRandomWords = require("../src/getRandomWords.js")
const getCuttings = require("../src/getCuttings.js")
const argv = require("minimist")(process.argv.slice(2))
const fs = require("fs")

var mark = new Markov(argv.order || 2)
mark.nullChar = "\n"
//getCuttings("bible", 100)
getRandomWords(100000000)
  .then(words => {
    console.log(words.length)
    //words = words.map(word => word.split(" "))
    try {
      for(var i in words)
        mark.feed(words[i])

      var imaginaryWords = []
      for(var i=0; i<10000; i++)
        imaginaryWords[i]=( mark.walk("", 100) )

      imaginaryWords = imaginaryWords.filter(word => word.length > 5).sort()
      var out = imaginaryWords.join(", ")
      console.log(out)
      if(argv.o)
        fs.writeFile(argv.o, out, console.log)

      console.log(mark.evaluate("cat"))
    } catch(e) {
      console.log(e)
    }
  })

const Paragraph = require("../src/Paragraph.js")
const argv = require("minimist")(process.argv.slice(2))

var para = new Paragraph(argv._[0] || "Hello, I'm Joel")
para.fetchInfo().then(() => {

  for(var i in para.bits) {
    if(!para.bits[i].isWord)
      console.log(para.bits[i])
    else {
      console.log(para.bits[i].w, para.bits[i]._pos)
    }
  }
})

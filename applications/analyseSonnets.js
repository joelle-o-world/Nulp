var Paragraph = require("../src/Paragraph.js");
var sonnets = require("../resources/parseSonnets.js");

for(var i=0; i<sonnets.length; i++) {
  new Paragraph(sonnets[i]).fetchInfo().then(function(sonnet) {
    var stress = sonnet.lines.map(function(line) {
      return line.phonoString(true) + "\t\t// "+line.print;
    }).join("\n");
    console.log(stress, "\n\n");
  })
}

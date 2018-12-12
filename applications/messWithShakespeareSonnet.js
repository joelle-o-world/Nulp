var randSonnet = require("../resources/randomShakespeareSonnet.js");
const Paragraph = require("./Paragraph.js");

var sonnet = new Paragraph( randSonnet() );
sonnet.analyse().then(function() {
  sonnet.qify();
  console.log(sonnet.print);
  sonnet.rollQs().then(function() {
    console.log(sonnet.print);
    logbook(sonnet.print);
  })
});

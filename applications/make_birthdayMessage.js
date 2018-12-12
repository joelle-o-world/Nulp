const Paragraph = require("./Paragraph.js");
var argv = require("minimist")(process.argv.slice(2))
var Promise = require("promise");
var logbook = require("../logbook.js");

var n = argv.n || 1;
var speak = argv.speak;
var friendName = argv._[0] || "Lionel";
var msgTemplate = "_adj_alit=h _noun_alit=b to you,\n" +
                  "_adj_alit=h _noun_alit=b to you\n" +
                  "_adj_alit=h _noun_alit=b dear " + friendName + "\n" +
                  "_adj_alit=h _noun_alit=b to you!";
if(argv.alt) {
  msgTemplate = "And they are an _advb_ _adj_ _noun_ ,\n" +
                    "And they are an _advb_ _adj_ _noun_ ,\n" +
                    "And they are an _advb_ _adj_ _noun_ ,\n" +
                    "And so say all of us!";
}
var nDone = 0;
var proms = [];
for(var i=0; i<n; i++) {
  var msg = new Paragraph(msgTemplate);
  proms.push( msg.rollQs().then(function(m) {
    console.log(nDone++, ":", m.print);
    logbook(m.print);
    if(speak) {
      m.makeDisjunctTTS(0, argv.l || "en-us").then(function(samp) {
        console.log(samp);
        samp.save(
          "birthday message to " + friendName + (argv.alt?" (bside)":""),
          "birthdayMsgs"
        );
      });
    }
    return m.print;
  }));
}

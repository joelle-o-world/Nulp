const getCuttings = require("./getCuttings.js")
const Paragraph = require("./Paragraph.js")
const Promise = require("promise");
const CollageThing = require("./CollageThing.js");
const logbook = require("../logbook.js");
var config = require("minimist")(process.argv.slice(2));

console.log("fetching cuttings");
getCuttings(config._[0], 10000).then(function(cuttings) {
  console.log("using", cuttings.length, "cuttings")
  if(config.q) {
    var promises = [];
    for(var i in cuttings) {
      cuttings[i] = new Paragraph(cuttings[i])
      promises.push(
        cuttings[i].analyse().then(function(cutting) {
          return cutting.qify().print;
        })
      )
    }
    return Promise.all(promises);
  } else
    return cuttings

}).then(function(qStrings) {

  var collager = new CollageThing();
  for(var i in qStrings) {
//    console.log("Adding qstring to collager:", qStrings[i]);
    collager.addFragment(qStrings[i]);
  }

  var txt = "";
  for(var i=0; txt.length<140; i++)
    txt = collager.extendUntilStop(txt);

  txt = new Paragraph(txt);
  console.log(txt.print, "\n\n");
  txt.rollQs().then(function() {

    console.log(txt.print, "\n\n");
    logbook(txt.print);
  })
})

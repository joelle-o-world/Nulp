const Paragraph = require("./Paragraph.js");
var cuttings = require("./getCuttings.js");

cuttings.getRandom().then(function(cutting) {
  console.log(cutting);
  cutting = cutting[0];
  console.log("\n\nOriginal:\n", cutting, "\n\n");
  cutting = new Paragraph(cutting);
  //console.log(cutting);
  cutting.analyse().then(function() {
    cutting.qify();
    cutting.rollQs().then(function() {
      console.log("\n\n", cutting.print, "\n\n");
    });
  })
});

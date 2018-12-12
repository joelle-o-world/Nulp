var argv = require("minimist")(process.argv.slice(2));
var Paragraph = require("./Paragraph.js");

var txt = argv._[0] || "Please enter some text as command line arguments!";
var doVowellsInstead = argv.v;

var text = new Paragraph(txt);

if(doVowellsInstead) {
    text.randomVowellhomophonSwapEverything().then(function() {
        console.log(text.print);
    })
} else if(argv.r) {
    text.randomRhymeSwapEverything().then(function() {
        console.log(text.print);
    })
} else if(argv.s) {
    text.randomSimiphonSwapEverything().then(function() {
        console.log(text.print);
    });
} else {
    text.randomConsohomophonSwapEverything().then(function() {
        console.log(text.print);
    });
}

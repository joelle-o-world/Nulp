var fs = require("fs");
var romanize = require("romans");
var argv = require("minimist")(process.argv.slice(2));

var txt = fs.readFileSync("./resources/texts/Sonnets (raw).txt", "utf-8");

var sonnets = [];
var bits = txt.split("\n\n");
for(var i=1; i<bits.length; i+=2) {
  sonnets.push(bits[i]);
}

module.exports = sonnets;

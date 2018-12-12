var fs = require("fs");

module.exports = function(path) {
    var file = fs.readFileSync(path || "./resources/gstrings.txt", "utf-8");
    var lines = file.split("\n");
    var gstrings = [];
    for(var i in lines) {
        if(lines[i] == "") continue;
        if(lines[i].slice(0,2) == "//") continue;

        gstrings.push(lines[i]);
    }

    gstrings = gstrings.sort(function(a,b) {
        return parseText(b).length - parseText(a).length;
    });

    return gstrings;
}

const Paragraph = require("./Paragraph.js");
var fs = require("fs");

function ImaginaryLanguage(name) {
    this.consonants = [];
    this.vowells = [];
    this.stops = [];
    this.probabilityOfStop = 0.5;

    this.englishDictionary = {};

    if(name && name.constructor == String) {
        this.load(name);
    }
}
module.exports = ImaginaryLanguage;

ImaginaryLanguage.prototype.sylGen = function() {
    var pre = this.consonants[Math.floor(Math.random()*this.consonants.length)];
    var vowell = this.vowells[Math.floor(Math.random()*this.vowells.length)];
    if(Math.random() < this.probabilityOfStop)
        var stop = this.stops[Math.floor(Math.random()*this.stops.length)];
    else
        var stop = "";
    return pre + vowell + stop;
}
ImaginaryLanguage.prototype.wordGen = function(nSyls) {
    nSyls = nSyls || Math.ceil(Math.random()*6);
    var w = "";
    for(var i=0; i<nSyls; i++)
        w += this.sylGen();
    return w;
}

ImaginaryLanguage.prototype.translateEnglishWord = function(w) {
    if(!this.englishDictionary[w])
        this.englishDictionary[w] = this.wordGen(w.length/2 * Math.random());
    return this.englishDictionary[w];
}
ImaginaryLanguage.prototype.translateEnglish = function(txt) {
    txt = new Paragraph(txt);
    for(var i in txt.words) {
        txt.words[i].w = this.translateEnglishWord(txt.words[i].w);
    }
    return txt.print;
}

ImaginaryLanguage.prototype.subLanguage = function(similarity) {
    similarity = similarity || 1/2 + 1/2 * Math.random();
    var newLang = new ImaginaryLanguage();
    newLang.vowells = this.vowells
        .sort(function() {return Math.random()-1/2;})
        .slice(0, Math.ceil(this.vowells.length*similarity));
    newLang.consonants = this.consonants
        .sort(function() {return Math.random()-1/2;})
        .slice(0, Math.ceil(this.consonants.length*similarity));
    newLang.stops = this.stops
        .sort(function() {return Math.random()-1/2;})
        .slice(0, Math.ceil(this.stops.length*similarity));
    newLang.probabilityOfStop = this.probabilityOfStop*similarity + Math.random()*(1-similarity);
    return newLang;
}

ImaginaryLanguage.prototype.load = function(name) {
    var path = "./resources/imaginary-languages/"+name+".json";
    if(fs.existsSync(path)){
        data = fs.readFileSync(path, "utf-8");
        data = JSON.parse(data);
        for(var i in data) {
            this[i] = data[i];
        }
    }
    this.name = name;
}
ImaginaryLanguage.prototype.save = function(name) {
    name = name || this.name;
    var path = "./resources/imaginary-languages/"+name+".json";
    var data = JSON.stringify(this);
    fs.writeFileSync(path, data);
    console.log("saved", path);
}

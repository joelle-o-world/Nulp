function Paragraph(model) {
    this.bits = new Array();

    if(model != undefined && model.constructor == String) {
        this.print = model;
    } else if(model != undefined && model.isParagraph) {
        this.print = model.print;
    }
}
module.exports = Paragraph;

var parseText = require("../parseText.js");
var Word = require("../Word.js");
var Punc = require("../Punc.js");
var Promise = require("promise");
//var Sample = require("../../sound/Sample.js");
var Q = require("../Q.js");
var compareBits = require("../compareBits.js");
var gstrings = require("../gstrings.js")();

Paragraph.prototype.isParagraph = true;

Paragraph.prototype.__defineGetter__("print", function() {
    var printedWords = [];
    var upper = false;
    for(var i in this.bits) {
        var bit = this.bits[i];
        if(bit.isWord) {
            var w = bit.w;
            if(upper) {
                w = w[0].toUpperCase() + w.slice(1);
                upper = false;
            }
            printedWords.push(w)
        } else if(bit.isPunc) {
            if(bit.str == "^") {
                upper = true;
                continue;
            }
            printedWords[printedWords.length-1] += bit.str;
        } else if(bit.isQ) {
            printedWords.push(bit.print);
        }
    }
    return printedWords.join(" ");
});
Paragraph.prototype.__defineSetter__("print", function(str) {
    var bits = parseText(str);
    this.bits = new Array();

    for(var i in bits) {
        if(bits[i][0] == "_") {
            var bit = new Q(bits[i]);
            this.bits.push(bit);
        } else if(bits[i].match(/[A-Za-z]/)) {
            var bit = new Word(bits[i]);
            //bit.text = this;
            this.bits.push(bit);
        } else {
            var bit = new Punc(bits[i]);
            //bit.text = this;
            this.bits.push(bit);
        }
    }
});

Paragraph.prototype.concatPhrases = require("./concatPhrases.js")

Paragraph.prototype.__defineGetter__("length", function() {
    return this.bits.length;
})

Paragraph.prototype.__defineGetter__("words", function() {
    var list = [];
    for(var i in this.bits) {
        if(this.bits[i].isWord)
            list.push(this.bits[i]);
    }
    return list;
});
Paragraph.prototype.stripPunctuation = function() {
    this.bits = this.words;
    return this;
}
Paragraph.prototype.__defineGetter__("lines", function() {
  var lines = [[]];
  for(var i in this.bits) {
    var bit = this.bits[i];
    if(bit.isPunc && bit.newline) {
      bit = bit.str.split("\n");
      if(bit[0].length)
        lines[lines.length-1].push(new Punc(bit[0]))
      lines.push([]);
      if(bit[1].length)
        lines[lines.length-1].push(new Punc(bit[1]))
    } else
      lines[lines.length-1].push(bit);
  }
  return lines.map(function(line) {
    var txt = new Paragraph();
    txt.bits = line;
    return txt;
  });
})

Paragraph.prototype.search = function(searchStr) {
    var sampleParagraph = this;
    var searchParagraph = new Paragraph(searchStr);
    var matches = [];
    for(var i=0; i+searchParagraph.bits.length <= sampleParagraph.bits.length; i++) {
        var match = true;
        for(var j=0; j<searchParagraph.bits.length; j++) {
            var A = sampleParagraph.bits[i+j];
            var B = searchParagraph.bits[j];
            if(!compareBits(A,B)) {
                match = false;
                break;
            }
        }
        if(match) {
            matches.push(i);
        }
    }
    return matches;
}
Paragraph.prototype.searchAndSolidifyPos = function(searchStr) {
    searchStr = new Paragraph(searchStr);
    var matches = this.search(searchStr);
    for(var i=matches.length-1; i>=0; i--) {
        if(i+1 != matches.length && matches[i+1]-matches[i] < searchStr.length)
            continue;
        for(var j=0; j<searchStr.length; j++) {
            if(searchStr.bits[j].isQ)
                var pos = searchStr.bits[j].pos;
            else if(searchStr.bits[j].isWord)
                var pos = "ir";
            else
                continue;

            if(this.bits[matches[i]+j].pos == undefined) {
                this.bits[matches[i]+j].pos = pos;
            }
        }
    }
    return this;
}
Paragraph.prototype.solidifySinglePosWords = function() {
    for(var i in this.bits) {
        if(this.bits[i].isWord && this.bits[i]._pos.length == 1) {
            //console.log(this.bits[i].w, this.bits[i]._pos);
            this.bits[i].pos = this.bits[i]._pos[0];
        }
    }
    return this;
}
Paragraph.prototype.swapAForAn = function() {
    for(var i in this.bits) {
        if(this.bits[i].w == "a") this.bits[i].w == "an";
    }
    return this;
}
Paragraph.prototype.fixIndefiniteArticles = function() {
    for(var i=0; i<this.bits.length; i++) {
        var bit = this.bits[i];
        if(bit.w == "a" || bit.w == "an") {
            var nextBit = this.bits[i+1];
            if(nextBit == undefined
            || !nextBit.isWord
            || nextBit.w[0].match(/[aeiouh]/))
                bit.w = "an";
            else
                bit.w = "a";
        }
    }
}
Paragraph.prototype.analyse = function() {
    this.swapAForAn();
    return this.fetchInfo().then(function() {
        this.solidifySinglePosWords();

        for(var i in gstrings) {
            this.searchAndSolidifyPos(gstrings[i]);
        }
        return this;
    }.bind(this))
}

Paragraph.prototype.qify = function() {
    for(var i in this.bits) {
        if(this.bits[i].isWord && this.bits[i].pos && this.bits[i].pos != "ir") {
            var q = new Q();
            q.pos = this.bits[i].pos;
            this.bits[i] = q;
        }
    }
    return this;
}
Paragraph.prototype.rollQ = function(q) {
    var text = this;
    return q.roll().then(function(w) {
        var i = text.bits.indexOf(q);
        if(i == -1)
            throw "Q not found";
        else
            text.bits[i] = new Word(w);
        return i;
    });
}
Paragraph.prototype.rollQs = function() {
    var proms = [];
    for(var i in this.bits) {
        if(this.bits[i].isQ) {
            proms.push( this.rollQ(this.bits[i]) );
        }
    }

    var text = this;
    return Promise.all(proms).then(function(arg) {
        text.fixIndefiniteArticles();
        return text;
    });
}

Paragraph.prototype.stressString = function(unspaced) {
  var stresses = this.words.map(function(w) {
    return w.stress;
  })
  return stresses.join(unspaced ? "" : " ");
}
Paragraph.prototype.phonoString = function(unspaced, reverse) {
  var phonos = this.words.map(function(w) {
    return w.phono;
  }).reverse();
  phonos = phonos.join(unspaced ? "" : " ");
  if(reverse)
    phonos = phonos.split("").reverse().join("");
  return phonos;
}

Paragraph.prototype.fetchInfo = function() {
    var proms = [];
    for(var i in this.bits) {
        if(this.bits[i].isWord)
            proms.push( this.bits[i].fetchInfo() );
    }

    var text = this;
    return Promise.all(proms).then(function() {
      return text;
    });
}

Paragraph.prototype.randomConsohomophonSwapEverything = function() {
    var proms = [];
    var words = this.words;
    for(var i in words) {
        proms.push( words[i].randomConsohomophonSwap());
    }
    return Promise.all(proms);
}
Paragraph.prototype.randomVowellhomophonSwapEverything = function() {
    var proms = [];
    var words = this.words;
    for(var i in words) {
        proms.push( words[i].randomVowellhomophonSwap());
    }
    // console.log(proms.length);
    return Promise.all(proms);
}
Paragraph.prototype.randomRhymeSwapEverything = function(nPhonemes) {
    var proms = [];
    words = this.words;
    for(var i in words) {
        proms.push( words[i].randomRhymeSwap(nPhonemes) );
    }
    return Promise.all(proms);
}
Paragraph.prototype.randomSimiphonSwapEverything = function(dissimilarity) {
    var proms = [];
    words = this.words;
    for(var i in words) {
        proms.push( words[i].randomSimiphonSwap(dissimilarity) );
    }
    return Promise.all(proms);
}

/*Paragraph.prototype.fetchTTSSamples = function(lang) {
    var words = this.words;
    var proms = [];
    for(var i in words) {
        proms.push(words[i].fetchTTSSample(lang));
    }
    return Promise.all(proms);
}
Paragraph.prototype.makeDisjunctTTS = function(sampleSpacing, lang) {
    var text = this;
    return new Promise(function(fulfil, reject) {
        text.fetchTTSSamples(lang || "random").then(function(vals) {
            var joinedSample = Sample.concat(vals, sampleSpacing)
            console.log("all done, ", joinedSample)
            fulfil( joinedSample );
        });
    })
}*/

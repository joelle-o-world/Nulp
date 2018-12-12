// requires below constructor declaration

function Word(w) {
    if(w != undefined && w.constructor == String)
        this.w = w;
    if(w != undefined && w.constructor == Word) {
        this.w = w.w;
        if(w._pos) this._pos = w._pos.slice();
        if(w.phono) this.phono = w.phono.slice();
        if(w.phonemes) this.phonemes = w.phonemes.slice();
        if(w.stress) this.stress = w.stress.slice();
        this.syllableCount = w.syllableCount;
    }
}
module.exports = Word;

var mysql = require("mysql");
var database = require("./sqlResources.js");
var Promise = require("promise");
//var tts = require("../sound/textToSpeech.js");
var cmudictKeys = require("./cmudictKeys.js");
var phonetic_queries = require("./phonetic_queries.js");

Word.prototype.isWord = true;

Word.prototype.__defineGetter__("str", function() {
  return this.w
})

Word.prototype.clear = function() {
    // return to a blank state of nature
    delete this.w;
    delete this._pos;
    delete this.phono;
    delete this.phonemes;
    delete this.stress;
    delete this.syllableCount;
}

Word.prototype.fetchInfo = function() {
    return Promise.all([this.fetchPOS(), this.fetchPhonology()]);
}
Word.prototype.fetchPOS = function() {
    // retrieves part-of-speech data from database and stores an array in this._pos
    // asynchronous, returns a promise

    var word = this;


    var queries = [];
    /*var query = "SELECT `tag` FROM `POS_tagging` WHERE `word` = "
        + database.escape(word.w);*/

    var queries = [];
    var query = "SELECT POS_tagging.tag FROM\n"
                + "POS_tagging INNER JOIN words ON words.id = POS_tagging.word_id\n"
                + "WHERE words.word = " + database.escape(word.w);
    var straight = database.query(query).then(function(response) {
        var tags = [];
        for(var i in response.results) {
            tags.push(response.results[i].tag);
        }
        return tags;
    }, console.log);
    queries[0] = (straight);

    // plural..
    if(this.w.charAt(this.w.length-1) == "s" && this.w.charAt(this.w.length-2) != "s") {
        var singularForm;
        if(this.w.charAt(this.w.length-2) == "e")
            singularForm = this.w.slice(0, this.w.length-2);
        else
            singularForm = this.w.slice(0, this.w.length-1);

        var query = "SELECT POS_tagging.tag FROM\n"
                  + "POS_tagging INNER JOIN words ON words.id = POS_tagging.word_id\n"
                  + "WHERE words.word = " + database.escape(singularForm);
        queries[1] = database.query(query).then(function(response) {
            for(var i in response.results) {
                if(response.results[i].tag == "noun") {
                    return true;
                }
            }
            return false;
        }, console.log)
    } else {
        queries[1] = false;
    }

    return Promise.all(queries).then(function(tagLists) {
        var straights = tagLists[0];
        var plural = tagLists[1];

        word._pos = word._pos || [];
        for(var i in straights) {
            word._pos.push(straights[i]);
        }

        if(plural) word._pos.push("plur")

        return word;
    });
}
Word.prototype.fetchPhonology = function() {
    // fetch phonetic data, store arrays in this.phono, this.phonemes, this.stress and a number in this.syllableCount
    // asynchronous, returns a promise

    var word = this;
    /*var q = "SELECT * FROM `phonology` WHERE `w` = "
        + database.escape(word.w)
        + " LIMIT 1";*/
    var q = "SELECT * FROM phonology JOIN words ON words.id = phonology.word_id\n"
          + "WHERE words.word = " + database.escape(word.w) + "\n"
          + "LIMIT 1";
    return database.query(q).then(function(response) {
        if(response.results[0]) {
            word.phono = response.results[0].phonetic;
            word.phonemes = cmudictKeys.extract(word.phono);
            word.stress = response.results[0].stress;
            word.syllableCount = response.results[0].syllable_n;
        } else {
            word.notInPhoneticDatabase = true;
        }
        return word;
    });
}

/*Word.prototype.fetchTTSSample = function(lang) {
    if(this._ttsSample) return this._ttsSample;

    var word = this;

    return new Promise(function(fulfil, reject) {
        tts(word.w, lang).then(function(samp) {
            word._ttsSample = samp;
            fulfil(samp);
        });
    });
}*/
Word.prototype.randomConsohomophonSwap = function() {
    var word = this;
    return phonetic_queries.getConsohomophons(this).then(function(options) {
        if(options.length >= 1) {
            word.clear();
            word.w = options[Math.floor(Math.random()*options.length)];
            return word.w;
        }
    });
}
Word.prototype.randomVowellhomophonSwap = function() {
    var word = this;
    //var original = this.w;
    return phonetic_queries.getVowellhomophons(this).then(function(options) {
        //console.log(original);
        if(options.length >= 1) {
            word.clear();
            word.w = options[Math.floor(Math.random()*options.length)];
            //console.log("oh yes:", original);
            return word.w;
        } else {
            //console.log("oh no");
            return word.w;
        }
    });
}
Word.prototype.randomRhymeSwap = function(nPhonemes) {
    var word = this;

    return phonetic_queries.getRhymes(this, nPhonemes)
    .then(function(options) {
        if(options.length >= 1) {
            word.clear();
            word.w = options[Math.floor(Math.random()*options.length)];
        }
        return word;
    });
}
Word.prototype.randomSimiphonSwap = function(dissimilarity) {
    var word = this;

    return phonetic_queries.getSimiphons(this, dissimilarity)
    .then(function(options) {
        if(options.length >= 1) {
            word.clear();
            word.w = options[Math.floor(Math.random()*options.length)];
        }
        return word;
    });
}

Word.randomWordFromPOS = function(tag) {
    //var q = "SELECT `word` FROM `POS_tagging` WHERE `tag` = \'"+tag+"\' ORDER BY RAND() LIMIT 1;";
    var q = "SELECT words.word FROM `words`\n"
          + "INNER JOIN `POS_tagging`\n"
          + "ON words.id = POS_tagging.word_id\n"
          + "WHERE POS_tagging.tag = " + database.escape(tag) + "\n";
          + "ORDER BY rand() LIMIT 1\n"
    return database.query(q).then(function(response) {
        return new Word(response.results[0].word);
    })
}

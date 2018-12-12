var Word = require("./Word.js");
var cmudictKeys = require("./cmudictKeys.js");
var Promise = require("promise");
//var mysql = require("mysql");
var database = require("./sqlResources.js");

function getConsohomophons(w) {
    // consohomophon is an imaginary term for a word with the same consonant pattern but different vowell sounds
    w = new Word(w);
    return w.fetchPhonology().then(function() {
        var phonoQ = "";
        for(var i in w.phono) {
            var c = w.phono[i];
            if(cmudictKeys.vowellChars.indexOf(c) != -1)
                phonoQ += "_";
            else
                phonoQ += c;
        }

        return phonoSearch(phonoQ).then(function(words) {
            var proms = [];
            for(var i in words) {
                words[i] = new Word(words[i]);
                proms.push(words[i].fetchPhonology());
            }
            return Promise.all(proms);
        }).then(function(words) {
            var consohomophons = [];
            //console.log(phonoQ, words);
            for(var i in words) {
                //console.log(i, words.length);
                for(var j=0; j<phonoQ.length; j++) {
                    //console.log("HA");
                    if(phonoQ[j] == "_" && cmudictKeys.vowellChars.indexOf(words[i].phono[j]) == -1)
                        break;
                }
                if(j == phonoQ.length) {
                    consohomophons.push(words[i].w);
                }
            }
            return consohomophons;
        });
    });

}
module.exports.getConsohomophons = getConsohomophons;

function getVowellhomophons(w) {
    // vowell is an imaginary term for a word with the same vowell pattern but different consonant sounds
    w = new Word(w);
    return w.fetchPhonology().then(function() {
        var phonoQ = "";
        for(var i in w.phono) {
            var c = w.phono[i];
            if(cmudictKeys.consonantChars.indexOf(c) != -1)
                phonoQ += "_";
            else
                phonoQ += c;
        }

        return phonoSearch(phonoQ);
    });

}
module.exports.getVowellhomophons = getVowellhomophons;

function getRhymes(w, nPhonemes) {
    nPhonemes = nPhonemes || 3;

    w = new Word(w);
    return w.fetchPhonology().then(function() {
        var phonoQ = w.phono.slice(0, nPhonemes) + "%";
        return phonoSearch(phonoQ);
    });
}
module.exports.getRhymes = getRhymes;

function getSimiphons(w, dissimilarity) {
    dissimilarity = dissimilarity || 0.5;
    w = new Word(w);
    return w.fetchPhonology().then(function() {
        var phonoQ = w.phono.split("");
        n = dissimilarity * phonoQ.length;
        for(var i=0; i<n; i++) {
            phonoQ[Math.floor(Math.random()*phonoQ.length)] = "_";
        }
        phonoQ = phonoQ.join("");

        return phonoSearch(phonoQ);
    });
}
module.exports.getSimiphons = getSimiphons;

function phonoSearch(phonoQ) {
    // var query = "SELECT `w` FROM `phonology` WHERE `phonetic` LIKE '" + phonoQ + "'";
    var query = "SELECT words.word FROM\n"
              + "words INNER JOIN phonology ON words.id = phonology.word_id\n"
              + "WHERE phonology.phonetic LIKE " + database.escape(phonoQ);

    return new Promise(function(fulfil, reject) {
        var connection = database.newConnection();
        connection.query(query, function(error, results, fields) {
            if(error) reject(error);
            var words = [];
            for(var i in results) {
                words.push(results[i].word);
            }
            fulfil(words);
        }, console.log);
        connection.end();
    });
}
module.exports.phonoSearch = phonoSearch;

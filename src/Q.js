var database = require("./sqlResources.js");

function Q(model) {
    this.args = {"_":[]};

    if(model && model.constructor == String)
        this.print = model;
    else if(model && model.constructor == Q)
        this.print = model.print;
}
module.exports = Q;

Q.prototype.isQ = true;

Q.prototype.__defineSetter__("print", function(str) {
    var args = str.split("_").slice(1);

    this.args = {};
    this.args._ = [];
    for(var i in args) {
        var argSplit = args[i].split("=");
        if(argSplit.length == 1)
            this.args._.push(args[i]);
        else if(argSplit.length == 2)
            this.args[argSplit[0]] = argSplit[1];
        else
            console.log("Something is wrong with QWord", str);
    }
    return this;
});
Q.prototype.__defineGetter__("print", function() {
    var args = [];
    for(var i in this.args._) {
        args.push(this.args._[i]);
    }
    for(var i in this.args) {
        if(i == "_") continue;

        args.push(i + "=" + this.args[i]);
    }
    return "_" + args.join("_") + "_";
});

Q.prototype.__defineGetter__("pos", function() {
    if(this.args._[0])
        return this.args._[0];
    else
        return undefined;
});
Q.prototype.__defineSetter__("pos", function(pos) {
    this.args._[0] = pos;
})
Q.prototype.__defineGetter__("stress", function() {
  return this.args.stress;
})
Q.prototype.__defineSetter__("stress", function(stress) {
  this.args.stress = stress;
});
Q.prototype.__defineGetter__("phono", function() {
  var phono = this.args.phono;
  if(phono != undefined)
    phono = phono.split("?").join("_");
  return phono;
});
Q.prototype.__defineSetter__("phono", function(phono) {
  this.args.phono = phono;
})
Q.prototype.__defineGetter__("nSyllables", function() {
  return this.args.n;
})
Q.prototype.__defineSetter__("nSyllables", function(n) {
  this.args.n = n;
})

Q.prototype.fits = function(word) {
    if(this.pos) {
        if(!word._pos) return false;
        if(word._pos.indexOf(this.pos) == -1)
            return false;
    }
    return true;
}

Q.prototype.__defineGetter__("sqlQuery", function() {
    var whereClauses = [];
    if(this.pos) {
      whereClauses.push("POS_tagging.tag = " + database.escape(this.pos));
    }
    if(this.stress)
      whereClauses.push(
        "phonology.stress LIKE " + database.escape(this.stress)
      );
    if(this.phono)
      whereClauses.push(
        "phonology.phonetic LIKE " + database.escape(this.phono)
      );
    if(this.nSyllables)
      whereClauses.push(
        "CHAR_LENGTH(phonology.stress) = " + this.nSyllables
      )
    if(this.args.alit)
      whereClauses.push(
        "words.word LIKE " + database.escape(this.args.alit + "%")
      );

    var q = "SELECT words.word FROM `words`\n" +
            "INNER JOIN `POS_tagging`\n" +
            "ON words.id = POS_tagging.word_id\n" +
            "INNER JOIN phonology\n" +
            "ON words.id = phonology.word_id\n"
    if(whereClauses.length > 0)
      q += "WHERE\n" + whereClauses.join("\nAND\n") + "\n";

  //  console.log(q);
    return q;
});

Q.prototype.roll = function() {
    var q = this.sqlQuery + "ORDER BY rand() LIMIT 1\n";
    //console.log(q)
    return database.query(q).then(function(response) {
      return response.results[0].word
    })
}

Q.prototype.rollMany = function(n) {
  n = n || 1
  var q = this.sqlQuery + "ORDER BY rand() LIMIT "+n+"\n"
  return database.query(q).then(function(response) {
    var words = response.results.map(function(row) {
      return row.word
    })
    return words
    //return response.results[0].word
  })
}

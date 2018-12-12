var fs = require("fs");
var {Writable} = require("stream");
var database = require("./sqlResources.js");

fs.writeFileSync("qOut.mysql", "");
var qOut = fs.createWriteStream("qOut.mysql", "utf-8");


var nNewlines = 0;
var currentLine = "";
var parser = new Writable();
var c, lastC;
parser.write = function(chunk, encoding, callback)  {
  for(var i=0; i<chunk.length; i++) {
    lastC = c;
    c = chunk[i];
    if(c == "\n") {
      nNewlines++;
      if(nNewlines > 2) {
        onLine(currentLine, nNewlines);
        currentLine = "";
      } else {
        currentLine += " ";
      }

    } else {
      nNewlines = 0;
      currentLine += c;
    }
  }
}
parser._final = function() {
  console.log("books:",books);
  console.log("longest verse:", longestVerseLength, "chars");
  console.log("biggest chapter number:", biggestChapterNumber);
  console.log("biggest verse number:", biggestVerseNumber);
  console.log("number of books:", books.length);
}


var nLines = 0;
var book, iBook, books = [];
function onLine(line) {
  nLines++;
  if(line == "")
    return ;

  var verseNumbers = line.match(/\d+:\d+/g)
  if(verseNumbers != null) {
    var verses = line.split(/\d+:\d+/g).slice(1);
    for(var i in verses) {
      onVerse(verseNumbers[i], verses[i]);
    }
    return;
  }

  book = line;
  books.push(line);
  iBook = books.length-1;
}
var longestVerseLength = 0, biggestVerseNumber = 0, biggestChapterNumber = 0;
function onVerse(vnum, body) {
  vnum = vnum.split(":");
  var chapter = parseInt(vnum[0]);
  var verse = parseInt(vnum[1]);

  var q = //"BEGIN;\n" +
      "INSERT INTO `cuttings` (`body`, `from`)\n" +
      "VALUES (" + database.escape(body) + ", 'bible');\n" +
      "INSERT INTO `bible` (`cutting_id`, `book`, `chapter`, `verse`)\n" +
      "VALUES(LAST_INSERT_ID(), "+iBook+", "+chapter+", "+verse+");\n"
      //+ "COMMIT;";
  //console.log(q, "\n\n");
  /*if(iBook == 0)
    database.query(q);*/
    qOut.write(q + "\n\n");



  // length competition
  if(body.length > longestVerseLength)
    longestVerseLength = body.length;
  if(chapter > biggestChapterNumber)
    biggestChapterNumber = chapter;
  if(verse > biggestVerseNumber)
    biggestVerseNumber = verse;
}

var readStream = fs.createReadStream("./resources/texts/Holy Bible.txt", "utf-8");
readStream.pipe(parser);

var database = require("./sqlResources.js");

module.exports = function(from, n) {
  n = n || 1;
  var q = "SELECT `body` FROM `cuttings`\n";
  console.log(from, "\n\n")
  if(from)
    q += "WHERE `from` = " + database.escape(from) + "\n";
  q += " ORDER BY rand() LIMIT "+n;
  console.log(q);

  return database.query(q).then(function(response) {
    var cuttings = [];
    for(var i in response.results) {
      cuttings.push(response.results[i].body);
    }
  //  return response.results[0].body;
    return cuttings;
  })
}

/*module.exports.addCutting = function(body, from) {
  from = from || "shaneen";
  var q = "INSERT INTO `cuttings` (`body`, `from`)\n" +
        "VALUES (" +  ")"
}*/
// FINISH ^ ^ ^

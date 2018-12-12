var mysql = require("mysql");
var Promise = require("promise");

var activeQueries = 0;
var mainConnection = false;

function newConnection() {
    var connection = mysql.createConnection({
        "host":"localhost",
        "user":"root",
        "password":"",
        "database":"shaneen_resources"
    });
    connection.connect();
    return connection;
}
module.exports.newConnection = newConnection;

function connect() {
  //console.log("connecting mySQL")
  mainConnection = newConnection();
  activeQueries = 0;
  return mainConnection;
}
function disconnect() {
//  console.log("disconnecting mySQL")
  mainConnection.end();
  mainConnection = undefined;
  activeQueries = 0;
}

module.exports.query = function(q) {
    var connection = mainConnection || connect();
    //console.log("Asking database:", q);
    return new Promise(function(fulfil, reject) {
        activeQueries++;
        connection.query(q, function(error, results, fields) {
            if(error) reject(error);
            else {
                activeQueries--;
                if(activeQueries == 0)
                  disconnect();
                fulfil({
                    "results": results,
                    "fields": fields
                });
            }
            //connection.end();
        })
    });
}

module.exports.escape = function(s) {
    return mysql.escape(s);
}

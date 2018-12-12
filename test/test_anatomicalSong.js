const anatomicalSong = require("../applications/anatomicalSong.js")
const argv = require("minimist")(process.argv.slice(2))

const n = argv.n || 1
const p = argv.p || 0
const alt = argv.alt || false

var stanza = anatomicalSong.printLines(n, alt)
var lines = stanza.split("\n")
console.log("\n\n" + stanza, "\n\n")

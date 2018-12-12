const bodyParts = require("../resources/list of body parts.json")

function randomBodyPart() {
  return bodyParts[Math.floor(Math.random()*bodyParts.length)]
}

const lineFunctions = [
  ()=>{ return ["You put your ", randomBodyPart(), " on my ", randomBodyPart()] },
  ()=>{ return ["I put my ", randomBodyPart(), " on your ", randomBodyPart()] },
  ()=>{ return ["You place your ", randomBodyPart(), " in my ", randomBodyPart()] },
  ()=>{ return ["I place my ", randomBodyPart(), " in your ", randomBodyPart()] },
  ()=>{ return ["You touch my ", randomBodyPart(), " with your ", randomBodyPart()] },
  ()=>{ return ["I touch your ", randomBodyPart(), " with my ", randomBodyPart()] },
]

const altLineFunctions = [
  ()=>{ return ["You swap your ", randomBodyPart(), " for my ", randomBodyPart()] },
  ()=>{ return ["I swap my ", randomBodyPart(), " for your ", randomBodyPart()] },
  ()=>{ return ["You attach your ", randomBodyPart(), " to my ", randomBodyPart()] },
  ()=>{ return ["I attach my ", randomBodyPart(), " to your ", randomBodyPart()] },
  ()=>{ return ["You replace your ", randomBodyPart(), " with my ", randomBodyPart()] },
  ()=>{ return ["I replace my ", randomBodyPart(), " for your ", randomBodyPart()] },
  ()=>{ return ["You remove your ", randomBodyPart(), " and my ", randomBodyPart()] },
  ()=>{ return ["I remove my ", randomBodyPart(), " and your ", randomBodyPart()] },
  ()=>{ return ["You fuse your ", randomBodyPart(), " to my ", randomBodyPart()] },
  ()=>{ return ["I fuse my ", randomBodyPart(), " to your ", randomBodyPart()] },
  ()=>{ return ["You combine my ", randomBodyPart(), " with your ", randomBodyPart()] },
  ()=>{ return ["I combine your ", randomBodyPart(), " with my ", randomBodyPart()] },
  ()=>{ return ["You plug your ", randomBodyPart(), " into my ", randomBodyPart()] },
  ()=>{ return ["I plug my ", randomBodyPart(), " into your ", randomBodyPart()] },
  ()=>{ return ["You connect your ", randomBodyPart(), " to my ", randomBodyPart()] },
  ()=>{ return ["I connect my ", randomBodyPart(), " to your ", randomBodyPart()] },
  ()=>{ return ["You take off my ", randomBodyPart(), " and your ", randomBodyPart()] },
  ()=>{ return ["I take off your ", randomBodyPart(), " and my ", randomBodyPart()] },

]

function makeLine(alt) {
  if(alt)
    return altLineFunctions[Math.floor(Math.random()*altLineFunctions.length)]()
  else
    return lineFunctions[Math.floor(Math.random()*lineFunctions.length)]()
}

function makeLines(n, alt) {
  n = n || 4
  var lines = []
  for(var i=0; i<n; i++)
    lines.push(makeLine(alt))
  return lines
}

function printLine(line) {
  var line = line || makeLine()
  return line.join("")
}
function printLines(lines, alt) {
  lines = lines || 4
  if(lines && lines.constructor == Number)
    lines = makeLines(lines, alt)
  console.log(lines)
  var printedLines = []
  for(var i in lines)
    printedLines[i] = printLine(lines[i])
  return printedLines.join(",\n")+","
}


module.exports.randomBodyPart = randomBodyPart
module.exports.makeLine = makeLine
module.exports.makeLines = makeLines
module.exports.printLine = printLine
module.exports.printLines = printLines

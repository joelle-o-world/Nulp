
/*var keys = {"0":"HH","1":"IY1","2":"DH","3":"IY2","4":"TH","5":"IH0","6":"NG","7":"G","8":"AO1","9":"AW1","E":"EH2","K":"K","S":"S","L":"L","A":"AH0","M":"M","D":"EY1","R":"SH","N":"N","P":"P","O":"OY2","T":"T","J":"OW1","Z":"Z","W":"W","C":"D","@":"AH1","B":"B","?":"EH1","V":"V","I":"IH1",">":"AA1","Q":"R","=":"AY1","<":"ER0",";":"AE1",":":"AE2","F":"F","H":"IY0","Y":"Y","U":"UW1","G":"OW0","/":"UH1",".":"OY1","-":"OW2",",":"CH","+":"IH2","*":"EH0",")":"AO2","(":"AA0","'":"AA2","X":"ZH","&":"EY0","%":"AE0","$":"AW2","#":"EY2","\"":"UW0","!":"AH2","~":"UW2","}":"AO0","|":"JH","{":"AY2","z":"ER1","y":"UH2","x":"AY0","w":"ER2","v":"OY0","u":"UH0","t":"AW0","s":"IH","r":"AA"};
var iKeys ={"EH2":"E","K":"K","S":"S","L":"L","AH0":"A","M":"M","EY1":"D","SH":"R","N":"N","P":"P","OY2":"O","T":"T","OW1":"J","Z":"Z","W":"W","D":"C","AH1":"@","B":"B","EH1":"?","V":"V","IH1":"I","AA1":">","R":"Q","AY1":"=","ER0":"<","AE1":";","AE2":":","F":"F","IY0":"H","AW1":"9","AO1":"8","Y":"Y","UW1":"U","OW0":"G","G":"7","NG":"6","IH0":"5","TH":"4","IY2":"3","DH":"2","IY1":"1","HH":"0","UH1":"/","OY1":".","OW2":"-","CH":",","IH2":"+","EH0":"*","AO2":")","AA0":"(","AA2":"'","ZH":"X","EY0":"&","AE0":"%","AW2":"$","EY2":"#","UW0":"\"","AH2":"!","UW2":"~","AO0":"}","JH":"|","AY2":"{","ER1":"z","UH2":"y","AY0":"x","ER2":"w","OY0":"v","UH0":"u","AW0":"t","IH":"s","AA":"r"};
*/

var vowellKeys = {
    // vowells [aeiouAEIOU1234]
    "AA": "a",
    "AE": "A",
    "AH": "4",
    "AO": "0",
    "AW": "1",
    "AY": "2",
    "EH": "3",
    "ER": "e",
    "EY": "E",
    "IH": "i",
    "IY": "I",
    "OW": "o",
    "OY": "O",
    "UH": "u",
    "UW": "U",
}

var consonantKeys = {
    // consonants
    "B": "B",	//stop
    "CH": "C",	//affricate
    "D": "D",	//stop
    "DH": "d",	//fricative
    "F": "F",	//fricative
    "G": "G",	//stop
    "HH": "H",	//aspirate
    "JH": "J",	//affricate
    "K": "K",	//stop
    "L": "L",	//liquid
    "M": "M",	//nasal
    "N": "N",	//nasal
    "NG": "n",	//nasal
    "P": "P",	//stop
    "R": "R",	//liquid
    "S": "S",	//fricative
    "SH": "s",	//fricative
    "T": "T",	//stop
    "TH": "f",	//fricative
    "V": "V",	//fricative
    "W": "W",	//semivowel
    "Y": "Y",	//semivowel
    "Z": "Z",	//fricative
    "ZH": "z"	//fricative
}

var iKeys = {};
for(var i in consonantKeys) {
    iKeys[i] = consonantKeys[i];
}
for(var i in vowellKeys) {
    iKeys[i] = vowellKeys[i];
}

var keys = {};
for(var i in iKeys) {
    if(keys[iKeys[i]])
        console.log("ALERT!!");
    keys[iKeys[i]] = i;
}
//console.log(keys);

exports.vowellChars = [];
for(var i in vowellKeys) {
    exports.vowellChars.push(vowellKeys[i]);
}
exports.consonantChars = [];
for(var i in consonantKeys) {
    exports.consonantChars.push(consonantKeys[i]);
}

exports.compress = function(s) {
    // convert to database (single char) format
    var phonemes = s.split(" ");
    for(var i in phonemes) {
        phonemes[i] = phonemes[i].split(/[0-9]/)[0];
        if(iKeys[phonemes[i]] == undefined) {
            console.log("problem", phonemes[i]);
        }
        phonemes[i] = iKeys[phonemes[i]];
    }
    return phonemes.reverse().join("");
}
exports.extract = function(s) {
    // convert from database (single char) format
    var phonemes = s.split("");
    for(var i in phonemes) {
        if(keys[phonemes[i]] == undefined) {
            console.log("sheesh", phonemes[i]);
        }
        phonemes[i] = keys[phonemes[i]];
    }
    return phonemes.reverse().join(" ");
}

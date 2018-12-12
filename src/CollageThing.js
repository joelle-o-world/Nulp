var parseText = require("./parseText.js");

function CollageThing() {
	this.fragments = new Array();
	this.delimiter = " ";
	this.placeholder = "#";
	this.blank = "-";
	this.overlap = 2;
}
module.exports = CollageThing;

CollageThing.prototype.extend = function(s) {
	var options = this.extendSearch(s);
	return s + this.delimiter + options[Math.floor(Math.random()*options.length)];
}
CollageThing.prototype.extendUntilStop = function(s) {
	var options = this.extendSearch(s);
	var choice = options[Math.floor(Math.random()*options.length)];
	s = s + this.delimiter + choice;
	if(this.endPieces.indexOf(choice) == -1)
		return this.extendUntilStop(s);
	else
		return s;
}
CollageThing.prototype.extendSearch = function(s) {
	var ol = this.overlap;

	var words = s.split(this.delimiter);
	do {
		if(words.length > ol) {
			words = words.slice(words.length - ol);
		}
		var searchString = words.join(this.delimiter);
		var opts = this.search(searchString);
		ol--;
	}
	while (opts.length == 0 && ol >= 0);

	return opts;
}
CollageThing.prototype.extendBackwards = function(s) {
	var ol = this.overlap;

	var words = s.split(this.delimiter);
	do {
		if(words.length>ol) {
			words = words.slice(0, ol);
		}
		var searchString = this.placeholder + this.delimiter + words.join(this.delimeter);
		var opts = this.search(searchString);
		ol--;
	}
	while(opts.length == 0 && ol >= 0);

	if(opts.length == 0) {
		opts = this.endPieces;
	}

	return opts[Math.floor(Math.random()*opts.length)] + this.delimiter + s;
}

CollageThing.prototype.fillOut = function(s) {
	var swords = s.split(this.delimiter);
	while(swords.indexOf(this.placeholder) != -1) {
		var ph = swords.indexOf(this.placeholder);
		var opts = this.search(swords.join(this.delimiter));
		swords[ph] = opts[Math.floor(Math.random()*opts.length)];
	}
	return swords.join(this.delimiter);
}

CollageThing.prototype.searchFragment = function(fragment, search) {

	if(typeof fragment == "number") {
		fragment = this.fragments[i];
	}
	if(fragment == undefined) {
		return new Array();
	}
	if(search == "" || search == undefined) {
		return fragment.split(this.delimiter)[0];
	}

	var swords = search.split(this.delimiter);
	var fwords = fragment.split(this.delimiter);
	if(swords.indexOf(this.placeholder) == -1) {
		swords.push(this.placeholder);
	}
	var ph = swords.indexOf(this.placeholder);


	var options = new Array();

	for(var i=0; i+swords.length<=fwords.length; i++) {
		var bod = true;
		for(var j=0; j<swords.length && bod; j++) {

			if(fwords[i+j] != swords[j] && swords[j] != this.placeholder && swords[j] != this.blank) {
				bod = false;
			}
		}
		if (bod) {
			options.push(fwords[i+ph]);
		}
	}
	return options;
}

CollageThing.prototype.search = function(s) {
	var options = new Array();
	for(var i in this.fragments) {
		options = options.concat(this.searchFragment(this.fragments[i], s));
	}
	return options;
}

CollageThing.prototype.solutions = function(s) {
	var l = s.split(this.delimiter);
	var ind = l.indexOf(this.placeholder);
	var from = 0;
	var to = l.length;
	if(ind-from > this.overlap) {
		from = ind-this.overlap;
	}
	if(to-(ind+1) > this.overlap) {
		to = ind+1 + this.overlap;
	}
	var newquery = "";
	for(var i=from; i<to; i++) {
		newquery += l[i];
		if(i < to-1) {
			newquery += this.delimiter;
		}
	}
	var options = this.search(newquery);

	if(options.length == 0) {
		var wordAfterPlaceholder = l[l.indexOf(this.placeholder)+1];
		if(this.frontPieces.indexOf(wordAfterPlaceholder) != -1 || s == this.placeholder) {
			options = this.endPieces;
		}
	}

	return options;
}

CollageThing.prototype.__defineGetter__("frontPieces", function() {
	var list = new Array();
	for(var i in this.fragments) {
		var fragsplit = this.fragments[i].split(this.delimiter);
		list.push(fragsplit[0]);
	}
	return list;
});
CollageThing.prototype.__defineGetter__("endPieces", function() {
	var list = new Array();
	for(var i in this.fragments) {
		var fragsplit = this.fragments[i].split(this.delimiter);
		for(var j=fragsplit.length-1; j>=0; j--) {
			if(fragsplit[j] != undefined && fragsplit[j] != "") {
				list.push(fragsplit[j]);
				j = -1;
			}
		}

	}
	return list;
});

CollageThing.prototype.addFragment = function(frag) {
	frag = parseText(frag).join(" ");
	if(frag != undefined && frag != "") {
		this.fragments.push(frag);
	}
}
CollageThing.prototype.loadFromFile = function(file) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", file, false);
	xhttp.send();

	var frags = xhttp.responseText;
	frags = frags.split("\n");
	for(var i in frags) {
		this.addFragment(frags[i]);
	}
}

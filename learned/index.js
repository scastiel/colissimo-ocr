
var learned = {};
var files = ['./dates', './texte'];

for (var i = 0; i < files.length; i++) {
	var r = require(files[i]);
	for (var b in r) {
		if (!r.hasOwnProperty(b)) continue;
		learned[b] = r[b];
	}
}

module.exports = learned;


var learned = {};
var files = ['./dates', './texts'];

learned.characters = {};
for (var i = 0; i < files.length; i++) {
	var r = require(files[i]);
	for (var b in r) {
		if (!r.hasOwnProperty(b)) continue;
		learned.characters[b] = r[b];
	}
}

learned.postProcess = function(str) {
	str = str
		.replace(/l([A-Z])/g, 'I$1')
		.replace(/([A-Z]{2})l/g, '$1I')
		.replace(/((?:^|\s))ll/g, '$1Il')
		.replace(/(\d)([a-zA-Z])/g, '$1 $2')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/(\w{2})'(\w{2})/g, '$1-$2')
		.replace(/\s+/g, ' ')
		.replace(/est([a-z])/g, 'est $1')
		.replace(/surson/g, 'sur son')
		.replace(/dest inat/g, 'destinat')
		.replace(/parl(\W)/g, 'par l$1')
		.replace(/\sl-/g, ' l\'')
		.replace(/IVORYCOST/g, 'IVORY COST')
		.replace(/(\w{2})'/g, '$1-')
		.replace(/prêtà/, 'prêt à')
		.replace(/leterritoire/, 'le territoire')
	return str;
}

module.exports = learned;

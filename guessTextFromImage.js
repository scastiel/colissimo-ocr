
var f = require('./functions');

for (var i = 2; i < process.argv.length; i++) {

	var imagePath = process.argv[i];
	f.guessTextFromImage(imagePath, 242, function(err, str) {
		console.log(str);
	})

}
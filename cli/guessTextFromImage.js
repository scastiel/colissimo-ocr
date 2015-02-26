
var f = require('../index');

for (var i = 2; i < process.argv.length; i++) {

	var imagePath = process.argv[i];
	f.guessTextFromImage(imagePath, function(imagePath, err, str) {
		console.log(imagePath + ': ' + str);
	}.bind(null, imagePath))

}
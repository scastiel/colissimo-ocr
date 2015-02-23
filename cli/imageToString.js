
var f = require('../index');

for (var i = 2; i < process.argv.length; i++) {

	var imagePath = process.argv[i];
	f.imageToString(imagePath, 242, function(err, str) {
		console.log(str);
	})
}

var should = require('should');
var ocr = require('..');

function itShouldGuess(expectedText, fromImagePath) {
	it('should guess correct text from ' + fromImagePath, function(done) {
		ocr.guessTextFromImage(fromImagePath, 242, function(err, str) {
			should.not.exist(err);
			str.should.be.exactly(expectedText);
			done();
		})
	});
}

describe('Colissimo-OCR', function() {

	describe('Dates', function() {
		var dates = require('../images/dates/dates');
		for (var imagePath in dates) {
			var expectedText = dates[imagePath];
			var realImagePath = 'images/dates/' + imagePath;
			itShouldGuess(expectedText, realImagePath);
		}
	})

	describe('Texts', function() {
		var texts = require('../images/texts/texts');
		for (var imagePath in texts) {
			var expectedText = texts[imagePath];
			var realImagePath = 'images/texts/' + imagePath;
			itShouldGuess(expectedText, realImagePath);
		}
	})

})
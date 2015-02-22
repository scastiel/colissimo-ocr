
var getPixels = require("get-pixels")
var learnedDates = require('./learned/dates');

function arrayToString(array) {
	var nx = array.shape[0],
		ny = array.shape[1];
	var str = "";
	
	for (var x = 0; x < nx; x++)
		str += "-";
	str += "\n";
	
	for (var y = 0; y < ny; y++) {
		for (var x = 0; x < nx; x++) {
			str += array.get(x, y) === 0 ? ' ' : '•';
		}
		str += "\n";
	}

	for (var x = 0; x < nx; x++)
		str += "-";
	str += "\n";

	return str;
}

function blackAndWhite(array, threshold) {
	var newArray = array;

	var nx = array.shape[0],
		ny = array.shape[1];
	
	for (var y = 0; y < ny; y++) {
		for (var x = 0; x < nx; x++) {
			newArray.set(x, y, array.get(x, y) >= threshold ? 0 : 1);
		}
	}

	return newArray;
}

function removeEmptyLinesTop(array) {
	var nx = array.shape[0],
		ny = array.shape[1];

	var nbLinesToRemove = 0;
	for (var y = 0; y < ny; y++) {
		var emptyLine = true;
		for (var x = 0; x < nx; x++) {
			if (array.get(x, y) > 0) {
				emptyLine = false;
				break;
			}
		}
		if (emptyLine) {
			nbLinesToRemove++;
		} else {
			break;
		}
	}

	return array.lo(0, nbLinesToRemove)
}

function removeEmptyLinesBottom(array) {
	return removeEmptyLinesTop(array.step(1, -1)).step(1, -1);
}

function removeEmptyColumnsLeft(array) {
	return removeEmptyLinesTop(array.transpose(1, 0)).transpose(1, 0);
}

function removeEmptyColumnsRight(array) {
	return removeEmptyLinesBottom(array.transpose(1, 0)).transpose(1, 0);
}

function isColumnEmpty(array, x) {
	var ny = array.shape[1];
	
	var empty = true;
	for (var y = 0; y < ny; y++) {
		if (array.get(x, y) > 0) {
			empty = false;
			break;
		}
	}

	return empty;
}

function getEmptyColumns(array) {
	var nx = array.shape[0];

	var emptyColumns = [];
	for (var x = 0; x < nx; x++) {
		if (isColumnEmpty(array, x))
			emptyColumns.push(x);
	}

	return emptyColumns;
}

function extractBlocks(array) {
	var nx = array.shape[0],
		ny = array.shape[1];

	var blocks = [];
	var emptyColumns = getEmptyColumns(array);
	emptyColumns.push(nx);
	var from = 0, to;
	for (var c = 0; c < emptyColumns.length; c++) {
		to = emptyColumns[c];

		if (from !== to) {
			var block = array.hi(to, ny).lo(from, 0);
			blocks.push(block);
		}

		from = to + 1;
	}

	return blocks;

}

function arrayAs1D(array) {
	var nx = array.shape[0],
		ny = array.shape[1];
	
	var data = [];
	for (var y = 0; y < ny; y++) {
		for (var x = 0; x < nx; x++) {
			data.push(array.get(x, y));
		}
	}

	return data;
}

function extractBlocksFromImage(imagePath, threshold, callback) {
	getPixels(imagePath, function(err, pixels) {
		if (err)
			return callback(err);

		pixels = pixels.pick(null, null, 1);
		pixels = blackAndWhite(pixels, threshold);

		pixels = removeEmptyLinesTop(pixels);
		pixels = removeEmptyLinesBottom(pixels);
		pixels = removeEmptyColumnsLeft(pixels);
		pixels = removeEmptyColumnsRight(pixels);

		var blocks = extractBlocks(pixels);
		callback(null, blocks);
	})
}

function guessTextFromImage(imagePath, threshold, callback) {
	extractBlocksFromImage(imagePath, threshold, function(err, blocks) {
		if (err)
			return callback(err);
		var str = "";
		for (var j = 0; j < blocks.length; j++) {
			var block = blocks[j];
			str += learnedDates[arrayAs1D(block).join('')] || '?'
		}
		callback(null, str);
	})
}

module.exports = {
	extractBlocksFromImage: extractBlocksFromImage,
	arrayAs1D: arrayAs1D,
	arrayToString: arrayToString,
	guessTextFromImage: guessTextFromImage
};


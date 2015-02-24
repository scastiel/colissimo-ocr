
var f = require('../index');
var r = require('../learned');

function extractBlocksFromImage(imagePath) {
	return new Promise(function(resolve, reject) {
		f.extractBlocksFromImage(imagePath, 242, function(err, blocks) {
			if (err) reject(err);
			resolve(blocks);
		})
	})
}

Promise.all(process.argv.slice(2).map(extractBlocksFromImage))
	.then(function(blocksArray) {
		var blocks = []
		blocks = blocks.concat.apply(blocks, blocksArray);

		var uniqueBlocks = [];
		var alreadyHereBlocks = {};
		for (var i = 0; i < blocks.length; i++) {
			var block = blocks[i];
			if (!alreadyHereBlocks[f.arrayAs1D(block).join('')]) {
				alreadyHereBlocks[f.arrayAs1D(block).join('')] = true;
				uniqueBlocks.push(block);
			}
		}

		for (var i = 0; i < uniqueBlocks.length; i++) {
			var block = uniqueBlocks[i];
			var block1D = f.arrayAs1D(block).join('');
			if (!r[block1D]) {
				console.log(f.arrayToString(block).split(/\n/).map(function(s) { return s ? "// " + s : ""; }).join("\n"));
				console.log("r['" + block1D + "'] = '';");
				console.log();
			}
		}

	})

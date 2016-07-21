'use strict'

/** returns true if adjacent
 * Suppose a is in column 1. Then we have the following values for b:
 *    - + -
 *    + a +
 *    + + +
 * In column 2, we have:
 *    + + +
 *    + a +
 *    - + -
 * @param {Position} grid index
 * @param {Position} grid index
 * @returns {Boolean}
 */
function isAdjacent(a, b) {
	// Logic specific to which column a is in
	var columnSpecific;
	if (a.i % 2 == 1) {
		columnSpecific = (a.j == b.j - 1 && 1 == Math.abs(a.i - b.i));
	} else {
		columnSpecific = (a.j == b.j + 1 && 1 == Math.abs(a.i - b.i));
	}

	return ((a.i == b.i && 1 == Math.abs(a.j - b.j)) ||
			(a.j == b.j && 1 == Math.abs(a.i - b.i)) ||
			columnSpecific);
}

/**
 * Gets the index of the (i, j)th tile within the chain of selected tiles
 * @param {Position} grid index
 * @param {Position} grid index
 * @returns {Number} index
 */
function getChainIndex(inI, inJ) {
	for (var k = 0; k < gameState.selectionChain.length; k++) {
		if (gameState.selectionChain[k].i == inI && gameState.selectionChain[k].j == inJ) {
			var chainIndex = k;
			break;
		}
	}
	return chainIndex;
}


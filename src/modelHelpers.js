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
	if (a.x % 2 == 1) {
		columnSpecific = (a.y == b.y - 1 && 1 == Math.abs(a.x - b.x));
	} else {
		columnSpecific = (a.y == b.y + 1 && 1 == Math.abs(a.x - b.x));
	}

	return ((a.x == b.x && 1 == Math.abs(a.y - b.y)) ||
			(a.y == b.y && 1 == Math.abs(a.x - b.x)) ||
			columnSpecific);
}

/**
 * Gets the index of the (i, j)th tile within the chain of selected tiles
 * @param {Position} grid index
 * @param {Position} grid index
 * @returns {Number} index
 */
function getChainIndex(i, j) {
	for (var k = 0; k < gameState.selectionChain.length; k++) {
		if (gameState.selectionChain[k].x == i && gameState.selectionChain[k].y == j) {
			var chainIndex = k;
			break;
		}
	}
	return chainIndex;
}


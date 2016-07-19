'use strict'

function isAdjacent(a, b) {
	/* returns true if adjacent
	 *
	 * Suppose a is in column 1. Then we have the following values for b:
	 *    - + -
	 *    + a +
	 *    + + +
	 *
	 * In column 2, we have:
	 *    + + +
	 *    + a +
	 *    - + -
	 */

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

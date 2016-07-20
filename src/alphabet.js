// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';


// Random Characters:
// ----------------------------------------------------------------------------
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * creates a string containing a random (capital) letter
 * @returns {String}
 */
function randchar() {
	return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

// Scores and Weights (Scrabble):
// ----------------------------------------------------------------------------

/**
 * contains the base letter score for each letter
 */
var letterScores = { A: 1,
                     B: 3,
                     C: 3,
                     D: 4,
                     E: 1,
                     F: 4,
                     G: 2,
                     H: 4,
                     I: 1,
                     J: 8,
                     K: 5,
                     L: 4,
                     M: 2,
                     N: 1,
                     O: 1,
                     P: 3,
                     Q: 10,
                     R: 1,
                     S: 1,
                     T: 1,
                     U: 1,
                     V: 4,
                     W: 4,
                     X: 8,
                     Y: 4,
                     Z: 10 }

/**
 * contains the relative number of this letter to spawn
 * (taken from Scrabble)
 */
var letterDistrs = { A: 9,
                     B: 2,
                     C: 2,
                     D: 4,
                     E: 12,
                     F: 2,
                     G: 3,
                     H: 2,
                     I: 9,
                     J: 1,
                     K: 1,
                     L: 4,
                     M: 2,
                     N: 6,
                     O: 8,
                     P: 2,
                     Q: 1,
                     R: 6,
                     S: 4,
                     T: 6,
                     U: 4,
                     V: 2,
                     W: 2,
                     X: 1,
                     Y: 2,
                     Z: 1 }


/**
 * Gives the base score for a letter
 * @param {String} a single letter
 * @returns {Number} score
 */
function scoreForLetter(lett) {
	if (lett.toUpperCase() in letterScores) {
		return letterScores[lett.toUpperCase()];
	} else {
		throw "Tried to find score for non letter";
		return;
	}
}


/**
 * Gives a random character, weighted by the letterDistrs weights
 * @returns {String} random character
 */
function weightedChar() {
	// Construct virtual Scrabble pile
	var virtualPile = [];
	for (var i = 0; i < Object.keys(letterDistrs).length; i++) {
		var letter = Object.keys(letterDistrs)[i];
		var toAdd = Array(letterDistrs[letter]).fill(letter);
		virtualPile = virtualPile.concat(toAdd);
	}
	return virtualPile[Math.floor(Math.random() * virtualPile.length)];
}


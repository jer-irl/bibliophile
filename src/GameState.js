'use strict'

/**
 * Represents the Game's state at any given moment
 * @constructor
 */
function GameState() {
	// Variables with default initials
	this.gameboard = [];
	this.selectionChain = [];
	this.score = 0;
	this.moveCounter = 0;
	this.submittedWords = [];
	this.wordQualityIndex = 0;

}


// Readonly Methods:
// ---------------------------------------------------------------------------

/**
 * Returns the selected word from the chain of the gamestate
 * @returns {String} The selected string
 */
GameState.prototype.selectedWord = function() {
	var candidate = "";
	for (var iter = 0; iter < this.selectionChain.length; iter++){
		candidate += this.gameboard[this.selectionChain[iter].j][this.selectionChain[iter].i].lett;
	}
	return candidate;
}

/**
 * Determines whether a selection collides with the already selected chain.
 * @param {Position} The candidate position
 * @return {Boolean} true if collision
 */
GameState.prototype.selectionCollides = function(selpos) {
	var collides = false;

	// For each tile, check
	for (var iter = 0; iter < this.selectionChain.length - 1; iter++) {
		// If we did hit it, delete from the chain all tiles ahead of the selected one
		if (selpos.i == this.selectionChain[iter].i && selpos.j == this.selectionChain[iter].j) {
			collides = true;
			break;
		}
	}
	return collides;
}

// Mutating Methods:
// ---------------------------------------------------------------------------

/**
 * Pushes a selection to the selection chain
 * @param {Position} input coordinates (selpos)
 */
GameState.prototype.pushToSelectionChain = function(tile) {
	this.selectionChain.push(tile);
	return;
}

/**
 * Pops the last n items from the selection chain
 * @param {number} number of indexes to pop
 */
GameState.prototype.popFromSelectionChain = function(n) {
	var k = this.selectionChain.length - n - 1;
	for (var j = 0; j < k; j++){
		this.selectionChain.pop();
	}
}

/**
 * Clears the selection chain
 */
GameState.prototype.clearSelectionChain = function() {
	this.selectionChain = [];
}

// TODO
GameState.prototype.shuffleBoard = function() {
	throw "Not implemented";
	return;
};

/**
 * Adds the input word to the list of submitted words, and to the score
 * @param {String} word to accept
 */
GameState.prototype.addSubmittedWord = function(word) {
	this.submittedWords.push(word);
	this.score += baseWordScore(word);
	return;
}

/**
 * Get the default game board, with each tile selected by weightedChar
 */
GameState.prototype.initGameboard = function() {
	for (var j = 0; j < 8; j++) {
		this.gameboard.push([]);
		for (var i = 0; i < 7; i++) {
			var tileToPush = new Tile(i, j, weightedChar());
			this.gameboard[j].push(tileToPush);
		}
	}
	return;
}

GameState.prototype.toString = function() {
	var result = "";

	// Gameboard
	result += "Gameboard:\n";
	result += "-----------------------\n";
	//result += "|   |   |   |   |   |   |   |\n";
	for (var row = 0; row < 8; row++) {
		result += "| ";
		for (var col = 0; col < 7; col++) {
			result += this.gameboard[row][col].lett + " | ";
		}
		result += "\n";

		//result += "|   |   |   |   |   |   |   |\n";
		result += "-----------------------\n";
		//result += "|   |   |   |   |   |   |   |\n";
	}

	// Selection chain
	result += "\nSelection Chain:\n"
	for (var iter = 0; iter < this.selectionChain.length; iter++) {
		result += this.selectionChain[iter].toString();
	}

	return result;
}


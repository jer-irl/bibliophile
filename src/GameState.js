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


	// Readonly Methods:
	// ---------------------------------------------------------------------------

	/**
	 * Returns the selected word from the chain of the gamestate
	 * @returns {String} The selected string
	 */
	this.selectedWord = function() {
		var candidate = "";
		for (var i = 0; i < this.selectionChain.length; i++){
			candidate += this.gameboard[this.selectionChain[i].y][this.selectionChain[i].x];
		}
		return candidate;
	}

	/**
	 * Determines whether a selection collides with the already selected chain.
	 * @param {Position} The candidate position
	 * @return {Boolean} true if collision
	 */
	this.selectionCollides = function(selpos) {
		var collides = false;

		// For each tile, check
		for (var i = 0; i < this.selectionChain.length - 1; i++) {
			// If we did hit it, delete from the chain all tiles ahead of the selected one
			if (selpos.x == this.selectionChain[i].x && selpos.y == this.selectionChain[i].y) {
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
	this.pushToSelectionChain = function(coords) {
		this.selectionChain.push(coords);
		return;
	}

	/**
	 * Pops the last n items from the selection chain
	 * @param {number} number of indexes to pop
	 */
	this.popFromSelectionChain = function(n) {
		var k = this.selectionChain.length - n - 1;
		for (var j = 0; j < k; j++){
			this.selectionChain.pop();
		}
	}

	/**
	 * Clears the selection chain
	 */
	this.clearSelectionChain = function() {
		this.selectionChain = [];
	}

	// TODO
	this.shuffleBoard = function() {
		throw "Not implemented";
		return;
	};

	/**
	 * Adds the input word to the list of submitted words, and to the score
	 * @param {String} word to accept
	 */
	this.addSubmittedWord = function(word) {
		this.submittedWords.push(word);
		this.score += baseWordScore(word);
		return;
	}

	/**
	 * Get the default game board, with each tile selected by weightedChar
	 */
	this.initGameboard = function() {
		for (var j = 0; j < 8; j++) {
			var row = new Array(7).fill(undefined).map(weightedChar);
			this.gameboard.push(row);
		}
		return;
	}
}


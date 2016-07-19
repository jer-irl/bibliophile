'use strict'

function GameState() {
	// Variables with default initials
	this.gameboard = [];
	this.selectionChain = [];
	this.score = 0;
	this.moveCounter = 0;
	this.submittedWords = [];
	this.wordQualityIndex = 0;

	// Readonly Methods
	this.selectedWord = function() {
		var candidate = "";
		for (var i = 0; i < this.selectionChain.length; i++){
			candidate += this.gameboard[this.selectionChain[i].y][this.selectionChain[i].x];
		}
		return candidate;
	}
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

	// Mutating Methods
	this.pushToSelectionChain = function(coords) {
		this.selectionChain.push(coords);
	}
	this.popFromSelectionChain = function(n) {
		var k = this.selectionChain.length - n - 1;
		for (var j = 0; j < k; j++){
			this.selectionChain.pop();
		}
	}

	this.clearSelectionChain = function() {
		this.selectionChain = [];
	}
	this.shuffleBoard = function() {
		// TODO
		return;
	};
	this.addSubmittedWord = function(word) {
		this.submittedWords.push(word);
		this.score += baseWordScore(word);
		return;
	}
	this.initGameboard = function() {
		for (var j = 0; j < 8; j++) {
			var row = new Array(7).fill(undefined).map(weightedChar);
			this.gameboard.push(row);
		}
		return;
	}
}

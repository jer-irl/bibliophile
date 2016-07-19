// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';

function drawTile (location, color) {
	var tileWidth = Globals.tileWidth;
	var tileHeight = Globals.tileHeight;
	var tileSpace = Globals.tileSpace;
	var boardX = Globals.boardX;
	var boardY = Globals.boardY;

	var x = location.x * (tileWidth + tileSpace) + boardX;
	var y = location.y * (tileHeight + tileSpace) + ((tileHeight / 2) * (location.x % 2)) + boardY;
	Globals.ctx.fillStyle=color;
	Globals.ctx.fillRect(x, y, tileWidth, tileHeight);
	Globals.ctx.font="35px Garamond";
	Globals.ctx.fillStyle="#000000";
	Globals.ctx.rect(x, y, tileWidth, tileHeight);
	var text = Globals.ctx.measureText(gameState.gameboard[location.y][location.x]);
	var xOffset = (tileWidth - text.width) / 2;
	var yOffset = (tileHeight - text.height) / 2;

	Globals.ctx.fillText(gameState.gameboard[location.y][location.x], x + xOffset, y + 35);
}

function renderBoard () {
	Globals.ctx.fillStyle="#8F3931";
	Globals.ctx.fillRect(0, 0, Globals.c.width, Globals.c.height);

	// Draw a box with character for each tile
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 7; i++) {
			drawTile({x: i, y: j}, "#800000");
		}
	}

	// Draw the selection chain (or don't if empty)
	for (var i = 0; i < gameState.selectionChain.length; i++) {
		// Special case for first to please James
		if (i == 0) {
			drawTile(gameState.selectionChain[0], "#FFA319");
			continue;
		}
		// All non-first tiles:
		drawTile(gameState.selectionChain[i], "#FFB547");
	}

	Globals.ctx.stroke();
	showScore();
}

// Returns the index in the column of the next selected tile, and -1 if the column contains none
function nextSelectedTileInColumn(i) {
	var colIndex = -1;

	// For each column:
	for (var j = 0; j < 8 && colIndex < 0; j++) {
		// Check if it's in the chain of selected tiles
		for (var k = 0; k < gameState.selectionChain.length && colIndex < 0; k++) {
			if (gameState.selectionChain[k].x == i && gameState.selectionChain[k].y == j) {
				colIndex = j;
			}
		}
	}
	return colIndex;
}

// Gets the index of the (i, j)th tile within the chain of selected tiles
function getChainIndex(i, j) {
	for (var k = 0; k < gameState.selectionChain.length; k++) {
		if (gameState.selectionChain[k].x == i && gameState.selectionChain[k].y == j) {
			var chainIndex = k;
			break;
		}
	}
	return chainIndex;
}

function cleanUp(i, j) {
	if (j > -1) {
		var chainIndex = getChainIndex(i, j);
		if (chainIndex > -1) {
			gameState.selectionChain.splice(chainIndex, 1);
		}
		else {
			gameState.clearSelectionChain();
		}
	}
}

function adjustGameboard() {
	// Get the list of columns hit by the chain
	var columns = [false, false, false, false, false, false, false];

	for (var i = 0; i < gameState.selectionChain.length; i++) {
		columns[gameState.selectionChain[i].x] = true;
	}

	// For each column
	for (var i = 0; i < columns.length; i++) {
		if (columns[i]) {
			// Find the next instance in the column
			var colIndex = nextSelectedTileInColumn(i);

			// If there's a selected tile in the column, remove it from the list of selected tiles
			cleanUp(i,	colIndex);

			// Move the column down as long as there remain instances of the chain in it
			while (colIndex > -1) {
				for (var j = colIndex; j > 0; j--) {
					//alert("Replacing " + gameboard[j][i] + " at (" + i + ", " + j + ") with " + gameboard[j - 1][i]);
					gameState.gameboard[j][i] = gameState.gameboard[j - 1][i];
				}
				gameState.gameboard[0][i] = weightedChar();

				// Reset and look for another instance
				colIndex = nextSelectedTileInColumn();
				//alert("The next selected tile in the column is at index " + colIndex);

				// If there's a selected tile in the column, remove it from the list of selected tiles
				cleanUp(i, colIndex);
			}
		}
	}

	// For good measure
	gameState.clearSelectionChain();
}


function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function boardClicked(selpos) {
	// Helper vars:
	var collides = gameState.selectionCollides(selpos);
	var lenSelChain = gameState.selectionChain.length;

	// If empty chain:
	if (gameState.selectionChain.length == 0) {
		gameState.clearSelectionChain();
		gameState.pushToSelectionChain(selpos);
		return;
	}

	// Collision Handling
	else if (collides) {
		while (gameState.selectionCollides(selpos)) {
			gameState.popFromSelectionChain(1);
		}
		gameState.pushToSelectionChain(selpos);
		return;
	}

	// If we clicked on the last member of the chain, determine if we can submit the word
	else if (isWord(gameState.selectedWord()) &&
		     selpos.x == gameState.selectionChain[lenSelChain - 1].x &&
		     selpos.y == gameState.selectionChain[lenSelChain - 1].y) {
		showWord(gameState.selectedWord());
		gameState.addSubmittedWord(gameState.selectedWord());
		adjustGameboard();
		return;
	}

	// If we clicked adjacent the most recent member of the chain, add to it
	else if (isAdjacent(selpos, gameState.selectionChain[gameState.selectionChain.length - 1])) {
		gameState.pushToSelectionChain({x: selpos.x, y : selpos.y});
		return;
	}

	// Otherwise, kill the chain and move the selection
	else {
		gameState.clearSelectionChain();
		gameState.pushToSelectionChain(selpos);
		return;
	}
}

// Main entry point after intial setup
function clickHandling(evt) {
	var mousePos = getMousePos(Globals.c, evt);
	var selpos = pickTile(mousePos.x, mousePos.y);
	// If we're on the gamemboard itself
	if (selpos.x < 7 && selpos.x > -1 && selpos.y < 8 && selpos.y > -1) {
		boardClicked(selpos);
	}

	renderBoard();
}


function showScore() {
	document.getElementById("score").innerHTML = "Score: " + gameState.score;
}

function showWord(word) {
	document.getElementById("words").innerHTML = word + "</br>" + document.getElementById("words").innerHTML
}



function setup() {
	// Init c and ctx
	Globals.c = document.getElementById("myCanvas");
	Globals.ctx = Globals.c.getContext("2d");

	gameState.initGameboard();

	Globals.c.addEventListener('mouseup', clickHandling, false);

	renderBoard();
}

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



// Global vars and Calls
var Globals = {
                c: undefined,
                ctx: undefined,
				boardX: 10,
				boardY: 10,
				tileWidth: 50,
				tileHeight: 50,
				tileSpace: 3 }

var gameState = new GameState();
setup();



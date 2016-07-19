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

	// Draw the selection chain
	if (gameState.selection.x > -1 && gameState.selection.y > -1) {
		// First the head
		drawTile(gameState.selection, "#FFA319");
		// Then each member of the list
		for (var i = 0; i < gameState.selectionChain.length; i++) {
			drawTile(gameState.selectionChain[i], "#FFB547");
		}
	}

	Globals.ctx.stroke();
	showScore();
}

// Returns the index in the column of the next selected tile, and -1 if the column contains none
function nextSelectedTileInColumn(i) {
	var colIndex = -1;

	for (var j = 0; j < 8 && colIndex < 0; j++) {
		// Check if it's the selection
		if (gameState.selection.x == i && gameState.selection.y == j) {
			colIndex = j;
			//alert("Found the selection at (" + i + ", j" + ").");
		}
		// Check if it's in the chain of selected tiles
		else {
			for (var k = 0; k < gameState.selectionChain.length && colIndex < 0; k++)
			{
				if (gameState.selectionChain[k].x == i && gameState.selectionChain[k].y == j) {
					colIndex = j;
				}
			}
		}
	}
	return colIndex;
}

// Gets the index of the (i, j)th tile within the chain of selected tiles
function getChainIndex(i, j) {
	var chainIndex = -1;
	for (var k = 0; k < gameState.selectionChain.length && chainIndex < 0; k++) {
		if (gameState.selectionChain[k].x == i && gameState.selectionChain[k].y == j) {
			chainIndex = k;
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
			gameState.selection.x = -9001;
			gameState.selection.y = -9001;
		}
	}
}

function adjustGameboard() {
	// Get the list of columns hit by the chain
	var columns = [false, false, false, false, false, false, false];

	for (var i = 0; i < gameState.selectionChain.length; i++) {
		columns[gameState.selectionChain[i].x] = true;
	}
	columns[gameState.selection.x] = true;

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
				gameState.gameboard[0][i] = randchar();

				// Reset and look for another instance
				colIndex = nextSelectedTileInColumn();
				//alert("The next selected tile in the column is at index " + colIndex);

				// If there's a selected tile in the column, remove it from the list of selected tiles
				cleanUp(i, colIndex);
			}
		}
	}

	// For good measure
	gameState.selection = {x: -9001, y: -9001};
	gameState.selectionChain = [];
}

function selectedWord() {
	var candidate = "" + gameState.gameboard[gameState.selection.y][gameState.selection.x];
	for (var i = 0; i < gameState.selectionChain.length; i++){
		candidate += gameState.gameboard[gameState.selectionChain[i].y][gameState.selectionChain[i].x];
	}
	return candidate;
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function boardClicked(selpos) {
	// If there's no chain of selected tiles
	if (gameState.selectionChain.length == 0) {
		// Clicking the selection does nothing
		if (gameState.selection.x == selpos.x && gameState.selection.y == selpos.y) {
			gameState.selection = selpos;
			gameState.selectionChain = [];
		}
		// Clicking adjacent to the selection adds to the chain
		else if (isAdjacent(selpos, gameState.selection)) {
			gameState.selectionChain.push({x: selpos.x, y : selpos.y});
		}
		// Clicking elsewhere moves the selection
		else {
			gameState.selection = selpos;
			gameState.selectionChain = [];
		}
	}
	// If there is a chain of selected tiles
	else {
		// Clicking the selection kills the chain
		if (gameState.selection.x == selpos.x && gameState.selection.y == selpos.y) {
			gameState.selection = selpos;
			gameState.selectionChain = [];
		}
		// If we didn't click on the selection, determine if we clicked on a tile in the chain
		else
		{
			var collides = false;

			// For each tile, check
			for (var i = 0; i < gameState.selectionChain.length - 1 && !collides; i++) {
				// If we did hit it, delete from the chain all tiles ahead of the selected one
				if (selpos.x == gameState.selectionChain[i].x && selpos.y == gameState.selectionChain[i].y) {
					var k = gameState.selectionChain.length - i - 1;
					for (j = 0; j < k; j++){
						gameState.selectionChain.pop();
					}
					collides = true;
				}
			}

			// If we didn't collide with the chain, proceed
			if (!collides) {
				// If we clicked on the last member of the chain, determine if we can submit the word
				if (isWord(selectedWord()) && selpos.x == gameState.selectionChain[gameState.selectionChain.length - 1].x && selpos.y == gameState.selectionChain[gameState.selectionChain.length - 1].y) {
					showWord(selectedWord());
					gameState.addSubmittedWord(selectedWord());
					adjustGameboard();
				}
				// If we clicked adjacent the most recent member of the chain, add to it
				else if (isAdjacent(selpos, gameState.selectionChain[gameState.selectionChain.length - 1])) {
					gameState.selectionChain.push({x: selpos.x, y : selpos.y});
				}
				// Otherwise, kill the chain and move the selection
				else {
					gameState.selection = selpos;
					gameState.selectionChain = [];
				}
			}
		}
	}
	return;
}

// Main entry point after intial setup
function clickHandling(evt) {
	var mousePos = getMousePos(Globals.c, evt);
	var selpos = pickTile(mousePos.x, mousePos.y);
	// If we're on the gamemboard itself
	if (selpos.x < 7 && selpos.x > -1 && selpos.y < 8 && selpos.y > -1) {
		boardClicked(selpos);
	} else {
		Globals.selection = {x: -9001, y: -9001};
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
	this.selection = {x: -9001, y: -9001};
	this.selectionChain = [];
	this.score = 0;
	this.moveCounter = 0;
	this.submittedWords = [];
	this.wordQualityIndex = 0;

	// Methods
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



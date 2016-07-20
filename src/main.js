// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';

/**
 * Returns the index in the column of the next selected tile, and -1 if the column contains none
 * @param {Number} column index
 * @returns {Number} result
 */
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

/**
 * Cleans up after gameboard adjustment
 */
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

/**
 * Model changes in response to a sequence of tiles being accepted
 */
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

/**
 * Handles the logic for a selection of a tile on the board
 * @param {Position} selection tile index
 */
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
		// Update gameState
		gameState.addSubmittedWord(gameState.selectedWord());

		// Refresh page values
		showWord(gameState.selectedWord());
		showScore();

		// Adjust the Gameboard
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

/**
 * Switchboard for click events.  Main entry point after setup
 */
function clickHandling(evt) {
	var mousePos = getMousePos(Globals.c, evt);
	var selpos = pickTile(mousePos.x, mousePos.y);
	// If we're on the gamemboard itself
	if (selpos.x < 7 && selpos.x > -1 && selpos.y < 8 && selpos.y > -1) {
		boardClicked(selpos);
	}
	renderBoard();
}


/**
 * Gives initial values to c, ctx, and gameState members.  Also renders board.
 */
function init() {
	// Init c and ctx
	Globals.c = document.getElementById("myCanvas");
	Globals.ctx = Globals.c.getContext("2d");

	gameState.initGameboard();

	Globals.c.addEventListener('mouseup', clickHandling, false);

	renderBoard();
}


// Global vars and Calls: (entry points are generally from user clicking)
// ----------------------------------------------------------------------------

var Globals = {
                c: undefined,
                ctx: undefined,
				boardX: 10,
				boardY: 10,
				tileWidth: 50,
				tileHeight: 50,
				tileSpace: 3 }

var gameState = new GameState();
init();


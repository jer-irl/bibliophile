// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';

/**
 * Returns the index in the column of the next selected tile, and -1 if the column contains none
 * @param {Number} column index
 * @returns {Number} result
 */
function nextSelectedTileInColumn(inCol) {
	var colIndex = -1;

	// For each column:
	for (var col = 0; col < 8 && colIndex < 0; col++) {
		// Check if it's in the chain of selected tiles
		for (var k = 0; k < gameState.selectionChain.length && colIndex < 0; k++) {
			if (gameState.selectionChain[k].i == inCol && gameState.selectionChain[k].j == col) {
				colIndex = col;
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

	for (var iter = 0; iter < gameState.selectionChain.length; iter++) {
		columns[gameState.selectionChain[iter].i] = true;
	}

	// For each column
	for (var iter = 0; iter < columns.length; iter++) {
		if (columns[iter]) {
			// Find the next instance in the column
			var colIndex = nextSelectedTileInColumn(iter);

			// If there's a selected tile in the column, remove it from the list of selected tiles
			cleanUp(iter, colIndex);

			// Move the column down as long as there remain instances of the chain in it
			while (colIndex > -1) {
				for (var jaz = colIndex; jaz > 0; jaz--) {
					gameState.gameboard[jaz][iter] = gameState.gameboard[jaz - 1][iter];
				}
				gameState.gameboard[0][iter] = weightedChar();

				// Reset and look for another instance
				colIndex = nextSelectedTileInColumn();

				// If there's a selected tile in the column, remove it from the list of selected tiles
				cleanUp(iter, colIndex);
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
		     selpos.i == gameState.selectionChain[lenSelChain - 1].i &&
		     selpos.j == gameState.selectionChain[lenSelChain - 1].j) {
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
		var toPush = new Position(selpos.i, selpos.j);
		gameState.pushToSelectionChain(toPush);
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
	if (selpos.i < 7 && selpos.i > -1 && selpos.j < 8 && selpos.j > -1) {
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


// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';


/**
 * Model changes in response to a sequence of tiles being accepted
 */
function adjustGameboard() {
	// Mark tiles for sliding
	for (var iter = 0; iter < gameState.selectionChain.length; iter++) {
		var tile = gameState.selectionChain[iter];
		var colI = tile.i;
		var rowJ = tile.j;
		// Iterate up the column to the top, adding one to each tile's counter
		for (var theRow = rowJ - 1; theRow > -1; theRow--) {
			gameState.gameboard[theRow][colI].slideCounter += 1;
		}
	}

	// Show the deletion animations and delete from gameboard
	for (var iter = 0; iter < gameState.selectionChain.length; iter++) {
		var tile = gameState.selectionChain[iter];
		tile.showDeletion();
		gameState.gameboard[tile.j][tile.i] = null;
	}

	// Slide all down
	// Iterate from left to right, bottom to top
	for (var row = 7; row > -1; row--) {
		for (var col = 0; col < 7; col++) {
			var tile = gameState.gameboard[row][col];
			// If a null tile, continue and skip it
			if (tile == null || tile.slideCounter == 0) {
				continue;
			}

			var nToSlide = 0;
			nToSlide = tile.slideCounter;

			// Update gameboard
			gameState.gameboard[row + nToSlide][col] = tile;
			gameState.gameboard[row][col] = null;

			// Update tile
			tile.j += nToSlide;
			//tile.showSlideDown(nToSlide);
			tile.slideCounter = 0;
			//tile.x = tile.coordToPlace().x;
			//tile.y = tile.coordToPlace().y;
		}
	}

	// Add in new tiles to replace nulls
	// Iterate from left to right, bottom to top.
	for (var row = 7; row > -1; row--) {
		for (var col = 0; col < 7; col++) {
			if (gameState.gameboard[row][col] == null) {
				var theNewTile = new Tile(col, row, weightedChar());
				gameState.gameboard[row][col] = theNewTile;
			}
		}
	}


	// Clean selectionChain
	gameState.clearSelectionChain();
}

function sleep(duration) {
	var now = new Date().getTime();
	while(new Date().getTime() < now + duration) {
		// Chill
	}
	return;
}

/**
 * Handles the logic for a selection of a tile on the board
 * @param {Position} selection tile index
 */
function boardClicked(selpos) {
	// Helper vars:
	var collides = gameState.selectionCollides(selpos);
	var lenSelChain = gameState.selectionChain.length;
	var tileToPush = gameState.gameboard[selpos.j][selpos.i];

	// If empty chain:
	if (gameState.selectionChain.length == 0) {
		gameState.clearSelectionChain();
		gameState.pushToSelectionChain(tileToPush);
		return;
	}

	// Collision Handling
	else if (collides) {
		while (gameState.selectionCollides(selpos)) {
			gameState.popFromSelectionChain(1);
		}
		gameState.pushToSelectionChain(tileToPush);
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
		gameState.pushToSelectionChain(tileToPush);
		return;
	}

	// Otherwise, kill the chain and move the selection
	else {
		gameState.clearSelectionChain();
		gameState.pushToSelectionChain(tileToPush);
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

	// Begin Render Loop
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


'use strict'

/**
 * Updates the onscreen score to reflect the gameState score
 */
function showScore() {
	document.getElementById("score").innerHTML = "Score: " + gameState.score;
}

/**
 * Adds a word to the onscreen list
 * @param {String} word to add
 */
function showWord(word) {
	document.getElementById("words").innerHTML = word + "</br>" + document.getElementById("words").innerHTML
}

/**
 * Renders the tiles on the board in their positions
 */
function renderBoard () {
	Globals.ctx.fillStyle="#8F3931";
	Globals.ctx.fillRect(0, 0, Globals.c.width, Globals.c.height);

	// Draw a box with character for each tile
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 7; i++) {
			gameState.gameboard[j][i].drawTile("#800000");
		}
	}

	// Draw the selection chain (or don't if empty)
	for (var i = 0; i < gameState.selectionChain.length; i++) {
		// Special case for first to please James
		if (i == 0) {
			gameState.selectionChain[0].drawTile("#FFA319");
			continue;
		}
		// All non-first tiles:
		gameState.selectionChain[i].drawTile("#FFB547");
	}

	Globals.ctx.stroke();
	console.log(gameState.toString());
}


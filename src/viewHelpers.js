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
function showSubmittedWords() {
	var outList = '';
	for (var i = gameState.submittedWords.length - 1; i > -1; i--) {
		outList += gameState.submittedWords[i];
		outList += " ";
		outList += baseWordScore(gameState.submittedWords[i]);
		outList += "</br>";
	}
	document.getElementById("words").innerHTML = outList;
}

/**
 * Renders the tiles on the board in their positions
 */
function renderBoard () {
	// Log
	console.log("renderBoard() called");

	// Make Board
	Globals.ctx.clearRect(0, 0, Globals.c.width, Globals.c.height);
	Globals.ctx.fillStyle="#FFFF99";
	Globals.ctx.fillRect(0, 0, Globals.c.width, Globals.c.height);

	// Draw each tile
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 7; i++) {
			gameState.gameboard[j][i].drawTile();
		}
	}

	Globals.ctx.stroke();

	// Check if still queued animations
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 7; i++) {
			if (gameState.gameboard[j][i].animationStatus != TileAnimationStatus.None) {
				window.requestAnimationFrame(renderBoard);
				return;
			}
		}
	}
	// Else
	return;
}


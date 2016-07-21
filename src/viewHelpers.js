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
			var pos = new Position(i, j);
			drawTile(pos, "#800000");
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
}

/**
 * Draw a single tile
 * @param {Position} grid index
 * @param {Color} fill color for tile
 */
function drawTile (pos, color) {
	var tileWidth = Globals.tileWidth;
	var tileHeight = Globals.tileHeight;
	var tileSpace = Globals.tileSpace;
	var boardX = Globals.boardX;
	var boardY = Globals.boardY;

	var x = pos.i * (tileWidth + tileSpace) + boardX;
	var y = pos.j * (tileHeight + tileSpace) + ((tileHeight / 2) * (pos.i % 2)) + boardY;
	Globals.ctx.fillStyle=color;
	Globals.ctx.fillRect(x, y, tileWidth, tileHeight);
	Globals.ctx.font="35px Garamond";
	Globals.ctx.fillStyle="#000000";
	Globals.ctx.rect(x, y, tileWidth, tileHeight);
	var text = Globals.ctx.measureText(gameState.gameboard[pos.j][pos.i]);
	var xOffset = (tileWidth - text.width) / 2;
	var yOffset = (tileHeight - text.height) / 2;

	Globals.ctx.fillText(gameState.gameboard[pos.j][pos.i], x + xOffset, y + 35);
}


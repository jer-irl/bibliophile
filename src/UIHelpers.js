'use strict';

/** Translates a board location to index in gameboard array
 * @param {Number} the mouse x coord
 * @param {Number} the mouse y coord
 * @returns {Position} grid indexes
 */
function pickTile( x, y ) {
	var i = Math.floor((x - Globals.boardX) / (Globals.tileWidth + Globals.tileSpace));
	var j = Math.floor((y - (((Globals.tileHeight / 2) * (i % 2)) + Globals.boardY))
	                   / (Globals.tileHeight + Globals.tileSpace));
	return { x: i, y: j };
}

/**
 * Gets the mouse coordinates for an event
 */
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


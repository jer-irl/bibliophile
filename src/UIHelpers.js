'use strict';

/** Translates a board location to index in gameboard array
 * @param {Number} the mouse x coord
 * @param {Number} the mouse y coord
 * @returns {Position} grid indices
 */
function pickTile( x, y ) {
	var theI = Math.floor((x - Globals.boardX) / (Globals.tileWidth + Globals.tileSpace));
	var theJ = Math.floor((y - (((Globals.tileHeight / 2) * (theI % 2)) + Globals.boardY))
	                   / (Globals.tileHeight + Globals.tileSpace));
	return new Position(theI, theJ);
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


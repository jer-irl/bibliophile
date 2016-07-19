'use strict';

function pickTile( x, y ) {
	// Translates a board location to index in gameboard array
	var i = Math.floor((x - Globals.boardX) / (Globals.tileWidth + Globals.tileSpace));
	var j = Math.floor((y - (((Globals.tileHeight / 2) * (i % 2)) + Globals.boardY))
	                   / (Globals.tileHeight + Globals.tileSpace));
	return { x: i, y: j };
}


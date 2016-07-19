'use strict';

function pickTile( x, y ) {
	// Translates a board location to index in gameboard array
	var i = Math.floor((x - boardX) / (tileWidth + tileSpace));
	var j = Math.floor((y - (((tileHeight / 2) * (i % 2)) + boardY))
	                   / (tileHeight + tileSpace));
	return { x: i, y: j };
}


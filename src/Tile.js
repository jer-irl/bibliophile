'use strict';

function Tile(theI, theJ, theLett) {
	// Indexes for grid
	this.i = theI;
	this.j = theJ;

	// Letter
	this.lett = theLett;

	// Coordinate for Drawing function
	this.x = this.coordToPlace().x;
	this.y = this.coordToPlace().y;

	// Counter for the sliding down
	this.slideCounter = 0;
}


// Neighbor accessors

/**
 * Dir is a string: up, down, left, right, upLeft, upRight, downLeft, downRight
 */
Tile.prototype.neighbor = function(direc) {
	// Cardinal directions
	if (direc == "up") {
		return gameState.gameboard[this.j - 1][this.i];
	} else if (direc == "down") {
		return gameState.gameboard[this.j + 1][this.i];
	} else if (direc == "right") {
		return gameState.gameboard[this.j][this.i + 1];
	} else if (direc == "left") {
		return gameState.gameboard[this.j][this.i - 1];
	}

	// Diagonals:
	if (this.i % 2 == 1) {
		if (direc == "upRight") {
			return gameState.gameboard[this.j][this.i + 1];
		} else if (direc == "upLeft") {
			return gameState.gameboard[this.j][this.i - 1];
		} else if (direc == "downRight") {
			return gameState.gameboard[this.j - 1][this.i + 1];
		} else if (direc == "downLeft") {
			return gameState.gameboard[this.j - 1][this.i - 1];
		}
	} else if (this.i % 2 == 0) {
		if (direc == "upRight") {
			return gameState.gameboard[this.j + 1][this.i + 1];
		} else if (direc == "upLeft") {
			return gameState.gameboard[this.j + 1][this.i - 1];
		} else if (direc == "downRight") {
			return gameState.gameboard[this.j][this.i + 1];
		} else if (direc == "downLeft") {
			return gameState.gameboard[this.j][this.i - 1];
		}
	}

	throw "Invalid input to neighbor";
	return;

}


// Drawing Methods

Tile.prototype.updateDisplayCoords = function() {
	// If already happily in place, do nothing
	if (this.x == this.coordToPlace().x &&
	    this.y == this.coordToPlace().y) {
		return;
	}
	// Else, move y one down
	else {
		this.y += 1;
		return;
	}
}

Tile.prototype.coordToPlace = function() {
	var tileWidth = Globals.tileWidth;
	var tileHeight = Globals.tileHeight;
	var tileSpace = Globals.tileSpace;
	var boardX = Globals.boardX;
	var boardY = Globals.boardY;

	var theX = this.i * (tileWidth + tileSpace) + boardX;
	var theY = this.j * (tileHeight + tileSpace) + ((tileHeight / 2) * (this.i % 2)) + boardY;
	return {x: theX, y: theY};
}

/**
 * Draw a single tile
 * @param {Position} grid index
 * @param {Color} fill color for tile
 */
Tile.prototype.drawTile = function(color) {
	// If not in place, update coords
	this.updateDisplayCoords();

	Globals.ctx.fillStyle=color;
	Globals.ctx.fillRect(this.x, this.y, Globals.tileWidth, Globals.tileHeight);
	Globals.ctx.font="35px Garamond";
	Globals.ctx.fillStyle="#000000";
	Globals.ctx.strokeRect(this.x, this.y, Globals.tileWidth, Globals.tileHeight);
	var text = Globals.ctx.measureText(gameState.gameboard[this.j][this.i].lett);
	var xOffset = (Globals.tileWidth - text.width) / 2;
	var yOffset = (Globals.tileHeight - text.height) / 2;

	Globals.ctx.fillText(gameState.gameboard[this.j][this.i].lett, this.x + xOffset, this.y + 35);
}

Tile.prototype.showDeletion = function() {
	console.log("Deletion Animation not implemented");
	return;
}


// Debug Methods

Tile.prototype.toString = function() {
	var out = "";
	out += "Tile(i: " + this.i + ", ";
	out += "j: " + this.j + ", ";
	out += "lett: " + this.lett + ")\n";
	return out;
}


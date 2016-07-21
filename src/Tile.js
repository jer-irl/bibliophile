'use strict';

function Tile(theI, theJ, theLett) {
	// Indexes for grid
	this.i = theI;
	this.j = theJ;

	// Letter
	this.lett = theLett;

	this.coordToPlace = function() {
		var tileWidth = Globals.tileWidth;
		var tileHeight = Globals.tileHeight;
		var tileSpace = Globals.tileSpace;
		var boardX = Globals.boardX;
		var boardY = Globals.boardY;

		var theX = this.i * (tileWidth + tileSpace) + boardX;
		var theY = this.j * (tileHeight + tileSpace) + ((tileHeight / 2) * (this.i % 2)) + boardY;
		return {x: theX, y: theY};
	}

	// Coordinate for Drawing function
	this.x = this.coordToPlace().x;
	this.y = this.coordToPlace().y;

	// Direction it needs to be moved.  'none', 'down' valid
	this.directionOfTravel = 'none';

	// I'm doing them as functions to avoid recursive explosions, because I don't trust javascript with any sort of lazy initializations.

	if (this.i % 2 == 1) {
		this.upRight = function () { return new Position(i+1, j); }
		this.upLeft = function () { return new Position(i-1, j); }
		this.downRight = function () { return new Position(i+1, j-1); }
		this.downLeft = function () { new Position(i-1, j-1); }
	} else if (this.i % 2 == 0) {
		this.upRight = function () { return new Position(i+1, j+1); }
		this.upLeft = function () { return new Position(i-1, j+1); }
		this.downRight = function () { return new Position(i+1, j); }
		this.downLeft = function () { return new Position(i-1, j); }
	}

	this.above = function() {
		return new Position(i, j-1);
	}

	this.below = function() {
		return new Position(i, j+1);
	}

	this.right = function() {
		return new Position(i+1, j);
	}

	this.left = function() {
		return new Position(i-1, j);
	}

	this.updateDisplayCoords = function() {
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

	/**
	 * Draw a single tile
	 * @param {Position} grid index
	 * @param {Color} fill color for tile
	 */
	this.drawTile = function(color) {
		console.log("drawTile called for" + this);
		Globals.ctx.fillStyle=color;
		Globals.ctx.fillRect(this.x, this.y, Globals.tileWidth, Globals.tileHeight);
		Globals.ctx.font="35px Garamond";
		Globals.ctx.fillStyle="#000000";
		Globals.ctx.rect(this.x, this.y, Globals.tileWidth, Globals.tileHeight);
		var text = Globals.ctx.measureText(gameState.gameboard[this.j][this.i].lett);
		var xOffset = (Globals.tileWidth - text.width) / 2;
		var yOffset = (Globals.tileHeight - text.height) / 2;

		Globals.ctx.fillText(gameState.gameboard[this.j][this.i].lett, this.x + xOffset, this.y + 35);
	}

	this.toString = function() {
		var out = "";
		out += "Tile(i: " + this.i + ", ";
		out += "j: " + this.j + ", ";
		out += "lett: " + this.lett + ")\n";
		return out;
	}
}


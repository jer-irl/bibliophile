'use strict';

function Position(theI, theJ) {
	this.i = theI;
	this.j = theJ;

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
}


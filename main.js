// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';



function drawTile (location, color) {
	var x = location.x * (tileWidth + tileSpace) + boardX;
	var y = location.y * (tileHeight + tileSpace) + ((tileHeight / 2) * (location.x % 2)) + boardY;
	ctx.fillStyle=color;
	ctx.fillRect(x, y, tileWidth, tileHeight);
	ctx.font="35px Garamond";
	ctx.fillStyle="#000000";
	ctx.rect(x, y, tileWidth, tileHeight);
	var text = ctx.measureText(gameboard[location.y][location.x]);
	var xOffset = (tileWidth - text.width) / 2;
	var yOffset = (tileHeight - text.height) / 2;

	ctx.fillText(gameboard[location.y][location.x], x + xOffset, y + 35);
}

function renderBoard () {
	ctx.fillStyle="#8F3931";
	ctx.fillRect(0, 0, c.width, c.height);

	// Draw a box with character for each tile
	for (var j = 0; j < 8; j++) {
		for (var i = 0; i < 7; i++) {
			drawTile({x: i, y: j}, "#800000");
		}
	}

	// Draw the selection chain
	if (selection.x > -1 && selection.y > -1) {
		// First the head
		drawTile(selection, "#FFA319");
		// Then each member of the list
		for (var i = 0; i < selectionChain.length; i++) {
			drawTile(selectionChain[i], "#FFB547");
		}
	}

	ctx.stroke();
}

// Returns the index in the column of the next selected tile, and -1 if the column contains none
function nextSelectedTileInColumn(i) {
	var colIndex = -1;

	for (var j = 0; j < 8 && colIndex < 0; j++) {
		// Check if it's the selection
		if (selection.x == i && selection.y == j) {
			colIndex = j;
			//alert("Found the selection at (" + i + ", j" + ").");
		}
		// Check if it's in the chain of selected tiles
		else {
			for (var k = 0; k < selectionChain.length && colIndex < 0; k++)
			{
				if (selectionChain[k].x == i && selectionChain[k].y == j) {
					colIndex = j;
				}
			}
		}
	}
	return colIndex;
}

// Gets the index of the (i, j)th tile within the chain of selected tiles
function getChainIndex(i, j) {
	var chainIndex = -1;
	for (var k = 0; k < selectionChain.length && chainIndex < 0; k++) {
		if (selectionChain[k].x == i && selectionChain[k].y == j) {
			chainIndex = k;
		}
	}
	return chainIndex;
}

function cleanUp(i, j) {
	if (j > -1) {
		var chainIndex = getChainIndex(i, j);
		if (chainIndex > -1) {
			selectionChain.splice(chainIndex, 1);
		}
		else {
			selection.x = -9001;
			selection.y = -9001;
			//alert("Moved the selection off the board.");
		}
		//alert("Removing (" + i + ", " + j + ") at index "  + chainIndex + " and in column " + j);
	}
}

function adjustGameboard() {
	// Get the list of columns hit by the chain
	var columns = [false, false, false, false, false, false, false];

	for (var i = 0; i < selectionChain.length; i++) {
		columns[selectionChain[i].x] = true;
	}
	columns[selection.x] = true;

	// For each column
	for (var i = 0; i < columns.length; i++) {
		if (columns[i])
		{
			//alert("Checking column " + i);

			// Find the next instance in the column
			var colIndex = nextSelectedTileInColumn(i);

			// If there's a selected tile in the column, remove it from the list of selected tiles
			cleanUp(i,	colIndex);

			// Move the column down as long as there remain instances of the chain in it
			while (colIndex > -1) {
				for (var j = colIndex; j > 0; j--) {
					//alert("Replacing " + gameboard[j][i] + " at (" + i + ", " + j + ") with " + gameboard[j - 1][i]);
					gameboard[j][i] = gameboard[j - 1][i];
				}
				gameboard[0][i] = randchar();

				// Reset and look for another instance
				colIndex = nextSelectedTileInColumn();
				//alert("The next selected tile in the column is at index " + colIndex);

				// If there's a selected tile in the column, remove it from the list of selected tiles
				cleanUp(i, colIndex);
			}
		}
	}

	// For good measure
	selection = {x: -9001, y: -9001};
	selectionChain = [];
}

function selectedWord() {
	var candidate = "" + gameboard[selection.y][selection.x];
	for (var i = 0; i < selectionChain.length; i++){
		candidate += gameboard[selectionChain[i].y][selectionChain[i].x];
	}
	return candidate;
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function boardClicked(mousePos, selpos) {
	// If there's no chain of selected tiles
	if (selectionChain.length == 0) {
		// Clicking the selection does nothing
		if (selection.x == selpos.x && selection.y == selpos.y) {
			selection = selpos;
			selectionChain = [];
		}
		// Clicking adjacent to the selection adds to the chain
		else if (isAdjacent(selpos, selection)) {
			selectionChain.push({x: selpos.x, y : selpos.y});
		}
		// Clicking elsewhere moves the selection
		else {
			selection = selpos;
			selectionChain = [];
		}
	}
	// If there is a chain of selected tiles
	else {
		// Clicking the selection kills the chain
		if (selection.x == selpos.x && selection.y == selpos.y) {
			selection = selpos;
			selectionChain = [];
		}
		// If we didn't click on the selection, determine if we clicked on a tile in the chain
		else
		{
			var collides = false;

			// For each tile, check
			for (var i = 0; i < selectionChain.length - 1 && !collides; i++) {
				// If we did hit it, delete from the chain all tiles ahead of the selected one
				if (selpos.x == selectionChain[i].x && selpos.y == selectionChain[i].y) {
					var k = selectionChain.length - i - 1;
					for (j = 0; j < k; j++){
						selectionChain.pop();
					}
					collides = true;
				}
			}

			// If we didn't collide with the chain, proceed
			if (!collides) {
				// If we clicked on the last member of the chain, determine if we can submit the word
				if (isWord(selectedWord()) && selpos.x == selectionChain[selectionChain.length - 1].x && selpos.y == selectionChain[selectionChain.length - 1].y) {
					adjustGameboard();
				}
				// If we clicked adjacent the most recent member of the chain, add to it
				else if (isAdjacent(selpos, selectionChain[selectionChain.length - 1])) {
					selectionChain.push({x: selpos.x, y : selpos.y});
				}
				// Otherwise, kill the chain and move the selection
				else {
					selection = selpos;
					selectionChain = [];
				}
			}
		}
	}
	return;
}

function clickHandling(evt) {
	var mousePos = getMousePos(c, evt);
	var selpos = pickTile(mousePos.x, mousePos.y);
	// If we're on the gamemboard itself
	if (selpos.x < 7 && selpos.x > -1 && selpos.y < 8 && selpos.y > -1) {
		boardClicked(mousePos, selpos);
	} else {
		selection = {x: -9001, y: -9001};
	}
	renderBoard();
}





function main() {
	// Init gameboard
	var gameboard = [];
	for (var j = 0; j < 8; j++) {
		var row = new Array(7).fill(undefined).map(weightedChar);
		gameboard.push(row);
	}

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var selection = {x : -9001, y : -9001};
	var selectionChain = [];

	// Declare some constants
	const boardX = 10;
	const boardY = 10;
	const tileWidth = 50;
	const tileHeight = 50;
	const tileSpace = 3;

	c.addEventListener('mouseup', clickHandling, false);

	renderBoard();
}



main();



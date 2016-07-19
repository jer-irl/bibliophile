// Strict mode enforces cleaner syntax, scoping, etc.
'use strict';

// The dictionary lookup object
var dict = {};
$.get("https://rawgit.com/jeresch/bibliophile/develop/ospd.txt", function( txt ) {
		// Get an array of all the words
		var words = txt.split( "\n" );
		// And add them as properties to the dictionary lookup
		// This will allow for fast lookups later
		for ( var i = 0; i < words.length; i++ ) {
			dict[ words[i] ] = true;
		}
	});

function isWord(candidate) {
	return candidate.length > 2 &&
		   dict[candidate.toLowerCase()];
}

function baseWordScore(word) {
	// For now, following a combination of Scrabble and Boggle rules

	// Boggle part:
	var bogglePart;
	var wordlen = word.length;
	switch (wordlen) {
		case 0:
		case 1:
		case 2:
			throw "Input word is too short but got past UI Checks";
			break;
		case 3:
		case 4:
			bogglePart = 1;
			break;
		case 5:
			bogglePart = 2;
			break;
		case 6:
			bogglePart = 3;
			break;
		case 7:
			bogglePart = 5;
			break;
		default:
			bogglePart = 11;
			break;
	}

	// Scrabble Part:
	var scrabblePart = 0;
	for (var i = 0; i < wordlen; i++) {
		scrabblePart += scoreForLetter(word[i]);
	}

	// Combining:
	var scrabbleFactor = 1;
	var boggleFactor = 1;
	var result = (scrabbleFactor * scrabblePart)
	           + (boggleFactor * bogglePart);

	return result;
}


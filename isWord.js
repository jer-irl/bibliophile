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


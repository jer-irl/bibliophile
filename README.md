# Bibliophile

A word game imitating a fond one from childhood. This will be fun.

## Running the Game

Currently, hte only browser we have been testing on is Chrome.  I know for a fact that Safari doesn't work.  Yeah, it's written in JavaScript.

## Code Style

- Tabs for indentation
	- Spaces to align arguments
- Braces in [1TBS style](https://en.wikipedia.org/wiki/Indent_style#Variant:_1TBS)
- CamelCase preferred
- Semicolons everywhere
- Otherwise, follow [airbnb's style guide](https://github.com/airbnb/javascript)
- [JSDoc](http://usejsdoc.org) for documentation, with markdown.

## TODO

### Features Wishlist

- ~~Make bonus tiles multiply tile score~~
- ~~Quadratic falling animation (that doesn't lag out)~~
- Flame tiles
- Frivolous animations
- Non-pixelly fullscreen mode
- Welcome Menu
- Game Saving
- Scrolling word list
- ~~Ban two-letter words~~
- ~~Weighted random character machine~~
- ~~Scoring procedure~~
- ~~Display score, possibly previous words~~
- ~~Annoying mascot?~~
- ~~Bonus tiles~~
- ~~Score adding shows word score~~
- ~~Show letter value for each tile~~
- ~~Overshooting catching for tiles, then snap to grid~~
- Nice Graphical background

### Known Bugs

- ~~After several word entries, tile selection gets laggy~~
- Randomly kills most of the tiles on the screen, exception with tileStatus undefined
	- When this happens, one of the tiles ends up with an undefined status.  I have to assume that this necessitates some rewriting to make thread-safe?
- Occasionally James complains about performance
	- Code changed to avoid a constant render loop, I'm not sure if that fixed it

### Pedantry Wishlist

- ~~function scoreForWord(string) -> Int~~
- Centralized animation queue
- ~~Class Board~~
	- ~~Generate new~~
	- ~~reset after word input~~
- Assets
- Perhaps moving to a real sprite library?

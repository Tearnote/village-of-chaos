// Create core game objects
const dom = new DOM();
const game = new Game();
const loop = new GameLoop();

// Wire the game object to the main loop
loop.onUpdate = function (dt, t) {
	game.update(dt);
};
loop.onRender = function (i) {
	game.render(dom);
};
loop.onPanic = function () {
	// No lag handling at this time
	this.timing.lag = 0;
};

// Start the game
loop.start();

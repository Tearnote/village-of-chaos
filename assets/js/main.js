// Create core game objects
let dom = new DOM();
let game = new Game(dom);
let loop = new GameLoop();

// Wire the game object to the main loop
loop.onUpdate = function (dt, t) {
	game.update(dt);
};
loop.onRender = function (i) {
	game.render();
};
loop.onPanic = function () {
	// No lag handling at this time
	this.timing.lag = 0;
};

// Start the game
loop.start();

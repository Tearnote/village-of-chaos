const loop = new GameLoop();

let food = 0;
loop.onUpdate = function(dt, t) {
	food += 0.01 * dt;
};
loop.onRender = function(i) {
	document.getElementById("food-amount").textContent = Math.floor(food);
};
loop.onPanic = function() {
	// No lag handling at this time
	this.timing.lag = 0;
};

loop.start();

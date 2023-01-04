// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	food = 0;
	wood = 0;
	stone = 0;

	update(dt) {
		this.food += 0.01 * dt;
	}

	render(dom) {
		dom.food.textContent = Math.floor(this.food);
		dom.wood.textContent = Math.floor(this.wood);
		dom.stone.textContent = Math.floor(this.stone);
	}
}

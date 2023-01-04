// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	food = 0;
	wood = 0;
	stone = 0;

	constructor(dom) {
		this.dom = dom;
		console.log(this.dom.gatherFood);
		console.log(this.gatherFood);
		this.dom.gatherFood.addEventListener(
			"click",
			this.gatherFood.bind(this)
		);
		this.dom.gatherWood.addEventListener(
			"click",
			this.gatherWood.bind(this)
		);
	}

	update(dt) {
		// Empty
	}

	render() {
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	gatherFood() {
		this.food += 1;
	}

	gatherWood() {
		this.wood += 1;
	}
}

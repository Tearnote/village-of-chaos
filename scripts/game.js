// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	constructor(dom) {
		this.dom = dom;

		// Resources
		this.food = 0;
		this.wood = 0;
		this.stone = 0;

		// Buildings
		this.houses = 0;

		// Register button clicks
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.gatherWood.addEventListener("click", this.gatherWood);

		// Add upgrades to the DOM
		for (let upgrade of UPGRADES) {
			this.dom.buildTab.appendChild(upgrade.createElement(this));
		}
	}

	update(dt) {
		// Mark upgrades that can't be bought
		for (let upgrade of UPGRADES) upgrade.updateElement(game);
	}

	render() {
		// Display resources
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};
}

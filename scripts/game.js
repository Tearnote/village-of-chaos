// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	static get MAX_LOG_MESSAGES() {
		return 12;
	}

	constructor(dom) {
		this.dom = dom;

		// Resources
		this.food = 0;
		this.wood = 0;
		this.stone = 0;

		// Buildings
		this.houses = 0;

		this.upgrades = [
			new Upgrade({
				name: "Build a house",
				cost: [20, 20, 0],
				once: false,
				scaling: 1.5,
				effect: function (game) {
					game.houses += 1;
				},
			}),
			new Upgrade({
				name: "Hunt down local wildlife",
				cost: [5, 5, 0],
				once: true,
				effect: function (game) {
					game.food += 30;
				},
			}),
		];

		// Register button clicks
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.gatherWood.addEventListener("click", this.gatherWood);

		// Build the villager assign table
		

		// Add upgrades to the DOM
		for (let upgrade of this.upgrades) {
			this.dom.buildTab.appendChild(upgrade.createElement(this));
		}

		this.logMessage("Welcome to Village of Chaos!");
	}

	update(dt) {
		// Mark upgrades that can't be bought
		for (let upgrade of this.upgrades) upgrade.updateElement(game);
	}

	render() {
		// Display resources
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	logMessage(msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		this.dom.log.appendChild(el);

		if (this.dom.log.children.length > Game.MAX_LOG_MESSAGES)
			this.dom.log.children[0].remove();
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};
}

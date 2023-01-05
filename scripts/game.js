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

		// Assignments
		this.unassigned = 0;

		// Balance and content
		this.production = {
			lumberjack: 0.0005,
		};
		this.upgrades = [
			new Upgrade({
				name: "Build a house",
				cost: [20, 20, 0],
				once: false,
				scaling: 2.5,
				effect: function (game) {
					game.houses += 1;
					game.unassigned += 2;
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
			new Upgrade({
				name: "Craft wooden axes",
				cost: [0, 50, 0],
				once: true,
				effect: function (game) {
					game.production.lumberjack *= 1.5;
				}
			})
		];

		// Register button clicks
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.gatherWood.addEventListener("click", this.gatherWood);

		// Add upgrades to the DOM
		for (let upgrade of this.upgrades) {
			this.dom.buildTab.appendChild(upgrade.createElement(this));
		}

		this.logMessage("Welcome to Village of Chaos!");
	}

	update(dt) {
		// Update assignment counts
		this.dom.unassigned.textContent = this.unassigned;

		// Mark upgrades that can't be bought
		for (let upgrade of this.upgrades) upgrade.updateElement(game);

		// Generate resources
		this.wood += dt * this.production.lumberjack * this.unassigned;
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

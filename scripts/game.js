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
		this.tentLvl = 0;
		this.pierLvl = 0;

		// Assignments
		this.unassigned = 0;

		// Balance and content
		this.production = {
			lumberjack: 0.0005,
		};
		this.upgrades = [
			new Upgrade({
				name: "Build a tent",
				description: "Has space for two villagers.",
				cost: [20, 20, 0],
				once: false,
				scaling: 2.5,
				effect: function (game) {
					this.name = "Expand the tent";
					this.description = "Add space for an extra villager.";
					if (game.tentLvl === 0) {
						game.unassigned += 2;
						game.logMessage(
							"event",
							"Two villagers have joined your settlement."
						);
					} else {
						game.unassigned += 1;
						game.logMessage(
							"event",
							"One extra villager has joined your settlement."
						);
					}
					game.tentLvl += 1;
				},
			}),
			new Upgrade({
				name: "Hunt down local wildlife",
				description:
					"Decimate local fluffy bunny population for some food.",
				cost: [5, 5, 0],
				once: true,
				effect: function (game) {
					game.food += 30;
					game.logMessage(
						"event",
						"You eradicated all bunnies. The ecosystem might recover someday."
					);
				},
			}),
			new Upgrade({
				name: "Craft wooden axes",
				description:
					"Your lumberjacks will be happy they don't have to use their bare fists anymore.",
				cost: [0, 50, 0],
				once: true,
				requirement: function (game) {
					return game.tentLvl >= 1 ? true : false;
				},
				effect: function (game) {
					game.production.lumberjack *= 1.5;
					game.logMessage(
						"event",
						"Your lumberjacks are now equipped with wooden axes."
					);
				},
			}),
		];

		// Register button clicks
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.gatherWood.addEventListener("click", this.gatherWood);

		// Add upgrades to the DOM
		for (let upgrade of this.upgrades) {
			this.dom.buildTab.appendChild(upgrade.createElement(this));
		}

		this.logMessage(
			"story",
			`It's a bright sunny day, and you are standing in the middle of a
			forest clearing. To your left is a glistening river full of fish,
			and the cliffs promise to provide bountiful building material. What
			attracted you to this place? Was it the prospect of escaping the
			hustle of city life? Or maybe you were curious about the giant
			black structure in the distance? Regardless of your reasons, you
			disembark.`
		);
		this.logMessage("info", "Welcome to Village of Chaos!");
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

	logMessage(type, msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		el.classList.add(type);
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

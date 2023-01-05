// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	constructor(dom) {
		this.dom = dom;

		// Resources
		this.wood = 0;
		this.food = 0;
		this.stone = 0;

		// Buildings
		this.tentLvl = 0;
		this.pierLvl = 0;
		this.quarryLvl = 0;

		// Assignments
		this.lumberjacks = 0;
		this.fishermen = 0;
		this.miners = 0;

		// Balance and content
		this.production = {
			lumberjack: 0.0005,
			fisherman: 0.0005,
			miner: 0.0005,
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
						game.lumberjacks += 2;
						game.logMessage(
							"event",
							"Two villagers have joined your settlement."
						);
					} else {
						game.lumberjacks += 1;
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
					"Catch the local fluffy bunny population for some food.",
				cost: [5, 5, 0],
				once: true,
				effect: function (game) {
					game.food += 40;
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
				cost: [0, 20, 0],
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
			new Upgrade({
				name: "Build a pier",
				description:
					"Construct a wooden pier for your villagers to fish from.",
				cost: [0, 50, 0],
				once: false,
				scaling: 2.5,
				requirement: function (game) {
					return game.tentLvl >= 1 ? true : false;
				},
				effect: function (game) {
					this.name = "Extend the pier";
					this.description =
						"A longer pier means access to bigger fish.";
					if (game.pierLvl === 0)
						game.logMessage(
							"event",
							"You built a pier, and can now assign fishermen."
						);
					else
						game.logMessage(
							"event",
							"Your fishermen can now catch bigger fish."
						);
					game.pierLvl += 1;
					if (game.pierLvl > 1) game.production.fisherman *= 1.5;
				},
			}),
			new Upgrade({
				name: "Build a quarry",
				description:
					"Prepare a spot on the cliff for your villagers to mine for stone.",
				cost: [0, 200, 0],
				once: false,
				scaling: 2.5,
				requirement: function (game) {
					return game.tentLvl >= 1 ? true : false;
				},
				effect: function (game) {
					this.name = "Expand the quarry";
					this.description =
						"Make more of the cliff surface available for mining.";
					if (game.quarryLvl === 0)
						game.logMessage(
							"event",
							"You built a quarry, and can now assign miners."
						);
					else
						game.logMessage(
							"event",
							"Your quarry is now more efficient."
						);
					game.quarryLvl += 1;
					if (game.quarryLvl > 1) game.production.miner *= 1.5;
				},
			}),
		];

		// Register button clicks
		this.dom.gatherWood.addEventListener("click", this.gatherWood);
		this.dom.gatherFood.addEventListener("click", this.gatherFood);

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
		this.dom.lumberjacks.textContent = this.lumberjacks;
		this.dom.fishermen.textContent = this.fishermen;
		this.dom.miners.textContent = this.miners;

		// Mark upgrades that can't be bought
		for (let upgrade of this.upgrades) upgrade.updateElement(game);

		// Generate resources
		this.wood += dt * this.production.lumberjack * this.lumberjacks;
		this.food += dt * this.production.fisherman * this.fishermen;
		this.stone += dt * this.production.miner * this.miners;
	}

	render() {
		// Display resources
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	logMessage(type, msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		el.classList.add(type);
		this.dom.log.prepend(el); // Prepend instead of append because of flexbox direction
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};
}

// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	constructor(dom) {
		this.dom = dom;

		// Resources
		this.wood = 100000;
		this.food = 100000;
		this.stone = 100000;

		// Buildings
		this.tentLvl = 0;
		this.pierLvl = 0;
		this.quarryLvl = 0;
		this.smithyLvl = 0;

		// Chaos levels
		this.pierChaos = 0;
		this.quarryChaos = 0;
		this.smithyChaos = 0;

		// Assignments
		this.lumberjacks = 0;
		this.fishermen = 0;
		this.miners = 0;
		this.blacksmiths = 0;

		// Balance and content
		this.production = {
			lumberjack: 0.001,
			fisherman: 0.001,
			miner: 0.001,
			blacksmith: 0.6,
		};
		this.upgrades = this.createUpgrades();

		// Register button clicks
		this.dom.gatherWood.addEventListener("click", this.gatherWood);
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.fishermenUp.addEventListener("click", this.assignFisherman);
		this.dom.fishermenDown.addEventListener(
			"click",
			this.unassignFisherman
		);
		this.dom.minersUp.addEventListener("click", this.assignMiner);
		this.dom.minersDown.addEventListener("click", this.unassignMiner);
		this.dom.blacksmithsUp.addEventListener("click", this.assignBlacksmith);
		this.dom.blacksmithsDown.addEventListener(
			"click",
			this.unassignBlacksmith
		);

		// Add upgrades to the DOM
		for (let upgrade of this.upgrades) {
			this.dom.buildTab.appendChild(upgrade.createElement(this));
		}

		// Add some flavor text
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

	createUpgrades() {
		return [
			new Upgrade({
				name: "Build a tent",
				description: "Has space for two villagers.",
				type: "craft",
				cost: [20, 20, 0],
				duration: 0.8,
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
				type: "craft",
				cost: [5, 5, 0],
				duration: 1.4,
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
				type: "craft",
				cost: [0, 20, 0],
				duration: 2,
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
				type: "craft",
				cost: [0, 50, 0],
				duration: 2.5,
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
				type: "craft",
				cost: [0, 200, 0],
				duration: 4,
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
			new Upgrade({
				name: "Build a smithy",
				description: "Assign blacksmiths to help you complete upgrades faster.",
				type: "craft",
				cost: [0, 100, 100],
				duration: 4,
				once: false,
				scaling: 2.5,
				requirement: function (game) {
					return game.quarryLvl >= 1 ? true : false;
				},
				effect: function (game) {
					this.name = "Modernize the smothy";
					this.description = "Get some new tools to make upgrades even faster.";
					if (game.smithyLvl === 0)
						game.logMessage("event", "You built a smithy to help speed up your upgrades!");
					else
						game.logMessage("event", "Your blacksmiths will now help you even more.");
					game.smithyLvl += 1;
					if (game.smithyLvl > 1) game.production.blacksmith *= 0.6;
				}
			})
		];
	}

	update(dt) {
		// Update upgrade state and progress
		for (let upgrade of this.upgrades) upgrade.update(game, dt);

		// Update chaos levels
		this.pierChaos = Math.max(1 - 0.8 ** (this.fishermen - 1), 0);
		this.quarryChaos = Math.max(1 - 0.8 ** (this.miners - 1), 0);
		this.smithyChaos = Math.max(1 - 0.8 ** (this.blacksmiths - 1), 0);

		// Generate resources
		this.wood += dt * this.getWoodProduction();
		this.food += dt * this.getFoodProduction();
		this.stone += dt * this.getStoneProduction();
	}

	render() {
		// Display resources
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.woodIncome.textContent = (
			this.getWoodProduction() * 1000
		).toFixed(1);
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.foodIncome.textContent = (
			this.getFoodProduction() * 1000
		).toFixed(1);
		this.dom.stone.textContent = Math.floor(this.stone);
		this.dom.stoneIncome.textContent = (
			this.getStoneProduction() * 1000
		).toFixed(1);
		this.dom.craftSpeed.textContent = (1 / this.getCraftSpeedup()).toFixed(1);

		// Update assignment counts
		this.dom.lumberjacks.textContent = this.lumberjacks;
		this.dom.fishermen.textContent = this.fishermen;
		this.dom.miners.textContent = this.miners;
		this.dom.blacksmiths.textContent = this.blacksmiths;

		// Update chaos indicators
		this.dom.pierChaos.textContent = Math.ceil(this.pierChaos * 100);
		this.dom.quarryChaos.textContent = Math.ceil(this.quarryChaos * 100);
		this.dom.smithyChaos.textContent = Math.ceil(this.smithyChaos * 100);
	}

	logMessage(type, msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		el.classList.add(type);
		this.dom.log.prepend(el); // Prepend instead of append because of flexbox direction
	}

	getWoodProduction() {
		return this.production.lumberjack * this.lumberjacks;
	}

	getFoodProduction() {
		return (
			this.production.fisherman * this.fishermen * (1 - this.pierChaos)
		);
	}

	getStoneProduction() {
		return this.production.miner * this.miners * (1 - this.quarryChaos);
	}

	getCraftSpeedup() {
		return 1 - (1 - this.production.blacksmith ** this.blacksmiths) * (1 - this.quarryChaos);
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};

	assignFisherman = () => {
		if (this.lumberjacks == 0) return;
		if (this.pierLvl == 0) return;
		this.lumberjacks -= 1;
		this.fishermen += 1;
	};

	unassignFisherman = () => {
		if (this.fishermen == 0) return;
		this.fishermen -= 1;
		this.lumberjacks += 1;
	};

	assignMiner = () => {
		if (this.lumberjacks == 0) return;
		if (this.quarryLvl == 0) return;
		this.lumberjacks -= 1;
		this.miners += 1;
	};

	unassignMiner = () => {
		if (this.miners == 0) return;
		this.miners -= 1;
		this.lumberjacks += 1;
	};

	assignBlacksmith = () => {
		if (this.lumberjacks == 0) return;
		if (this.smithyLvl == 0) return;
		this.lumberjacks -= 1;
		this.blacksmiths += 1;
	};

	unassignBlacksmith = () => {
		if (this.blacksmiths == 0) return;
		this.blacksmiths -= 1;
		this.lumberjacks += 1;
	};
}

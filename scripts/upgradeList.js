class Upgrade {
	constructor(params = {}) {
		this.name = params?.name;
		this.description = params?.description;
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // Array of 3 integers: [wood, food, stone]
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Only required if once is false
		this.requirement = params?.requirement; // Optional, array of fields and their minimum values for the upgrade to show up
		this.effect = params?.effect; // Function to run on buying
	}
}

Game.prototype.upgradeList = [
	// Major system progression upgrades
	new Upgrade({
		name: "Build a tent",
		description: "Has space for two villagers.",
		type: "craft",
		cost: [10, 10, 0],
		duration: 0.8,
		once: false,
		scaling: 2.5,
		effect: function (game) {
			this.name = "Expand the tent";
			this.description = "Add another bed to fit in an extra villager.";
			if (game.levels.tent === 0) {
				game.lumberjack += 2;
				game.logMessage(
					"event",
					"Two villagers have joined your settlement."
				);
				game.showElement("assign");
				game.showElement("income");
			} else {
				game.lumberjack += 1;
				game.logMessage(
					"event",
					"One extra villager has joined your settlement."
				);
			}
			game.levels.tent += 1;
		},
	}),
	new Upgrade({
		name: "Build a pier",
		description: "Construct a wooden pier for your villagers to fish from.",
		type: "craft",
		cost: [50, 0, 0],
		duration: 2.5,
		once: false,
		scaling: 2.5,
		requirement: ["tent", 1],
		effect: function (game) {
			this.name = "Extend the pier";
			this.description = "A longer pier means access to bigger fish.";
			if (game.levels.pier === 0) {
				game.logMessage(
					"event",
					"You built a pier, and can now assign fishermen."
				);
				game.showElement("fisherman");
			} else {
				game.logMessage(
					"event",
					"Your fishermen can now catch bigger fish."
				);
			}
			game.levels.pier += 1;
			if (game.levels.pier > 1) game.production.fisherman *= 1.5;
		},
	}),
	new Upgrade({
		name: "Build a quarry",
		description:
			"Prepare a spot on the cliff for your villagers to mine for stone.",
		type: "craft",
		cost: [200, 0, 0],
		duration: 4,
		once: false,
		scaling: 2.5,
		requirement: ["pier", 1],
		effect: function (game) {
			this.name = "Develop the quarry";
			this.description =
				"Make more of the cliff surface available for mining.";
			if (game.levels.quarry === 0) {
				game.logMessage(
					"event",
					"You built a quarry, and can now assign miners."
				);
				game.showElement("stone");
				game.showElement("miner");
			} else {
				game.logMessage("event", "Your quarry is now more efficient.");
			}
			game.levels.quarry += 1;
			if (game.levels.quarry > 1) game.production.miner *= 1.5;
		},
	}),
	new Upgrade({
		name: "Build a smithy",
		description:
			"Unlock new upgrades, and assign blacksmiths to help you complete upgrades faster.",
		type: "craft",
		cost: [100, 0, 100],
		duration: 4,
		once: false,
		scaling: 2.5,
		requirement: ["quarry", 1],
		effect: function (game) {
			this.name = "Modernize the smithy";
			this.description =
				"Get some new tools to unlock new upgrades and make them even faster to complete.";
			if (game.levels.smithy === 0) {
				game.logMessage("event", "You built a smithy! Nice!");
				game.showElement("blacksmith");
				game.showElement("craft-speed");
			} else {
				game.logMessage(
					"event",
					"Your blacksmiths will now be even more helpful."
				);
			}
			game.levels.smithy += 1;
			if (game.levels.smithy > 1) game.production.blacksmith *= 0.6;
		},
	}),
	new Upgrade({
		name: "Build an academy",
		description:
			"Unlock research into team management techniques, and assign professors to help speed it up.",
		type: "craft",
		cost: [500, 0, 500],
		duration: 10,
		once: false,
		scaling: 2.5,
		requirement: ["smithy", 3],
		effect: function (game) {
			this.name = "Grow the academy";
			this.description =
				"Develop new teaching aids to discover new techniques and improve existing ones.";
			if (game.levels.academy === 0) {
				game.logMessage(
					"event",
					"Your academy is now standing, towering above all except the monolith."
				);
				game.showElement("professor");
				game.showElement("research");
				game.showElement("research-speed");
			} else {
				game.logMessage(
					"event",
					"You add another floor to the already imposing academy building."
				);
			}
			game.levels.academy += 1;
			if (game.levels.academy > 1) game.production.professor *= 0.6;
		},
	}),
	new Upgrade({
		name: "Mentorship program",
		description: "What if you got one person to oversee another?",
		type: "research",
		cost: [10, 400, 2],
		duration: 6,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.showElement("mentor");
			game.mentorUnlocked = true;
			game.logMessage(
				"event",
				"Turns out mentors training novices is a pretty good idea!"
			);
		},
	}),
	new Upgrade({
		name: "People management",
		description: "Instead of working, make sure others are working.",
		type: "research",
		cost: [20, 2000, 10],
		duration: 20,
		once: true,
		requirement: ["academy", 3],
		effect: function (game) {
			game.showElement("manager");
			game.managerUnlocked = true;
			game.logMessage(
				"event",
				"You can now assign chaos controllers! Also known as managers."
			);
		},
	}),

	// Job upgrades
	new Upgrade({
		name: "Hunt down local wildlife",
		description: "Catch the local fluffy bunny population for some food.",
		type: "craft",
		cost: [5, 5, 0],
		duration: 1.4,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.food += 40;
			game.logMessage(
				"event",
				"You eradicated all bunnies. The ecosystem might recover someday."
			);
		},
	}),

	// Random upgrades
	new Upgrade({
		name: "Craft wooden axes",
		description:
			"Your lumberjacks will be happy they don't have to use their bare fists anymore.",
		type: "craft",
		cost: [20, 0, 0],
		duration: 2,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.5;
			game.logMessage(
				"event",
				"Your lumberjacks are now equipped with wooden axes."
			);
		},
	}),
];
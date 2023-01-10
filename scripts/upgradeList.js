class Upgrade {
	constructor(params = {}) {
		this.name = params?.name;
		this.description = params?.description;
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // An object with keys "wood", "food", "stone"
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
		cost: {
			wood: 10,
			food: 10,
		},
		duration: 2,
		once: true,
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 2;
			game.unlock("assign");
			game.unlock("income");
			game.logMessage(
				"event",
				"Two villagers have joined your settlement."
			);
		},
	}),
	new Upgrade({
		name: "Expand the tent",
		description: "Add another bed to fit in an extra villager.",
		type: "craft",
		cost: {
			wood: 20,
			food: 40,
		},
		duration: 2,
		once: false,
		scaling: 2,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.tent += 1;
			game.lumberjack += 1;
			game.logMessage(
				"event",
				"One extra villager has joined your settlement."
			);
		},
	}),
	new Upgrade({
		name: "Build a pier",
		description: "Construct a wooden pier for your villagers to fish from.",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 4,
		once: true,
		requirement: ["tent", 1],
		effect: function (game) {
			game.levels.pier += 1;
			game.unlock("fisherman");
			game.logMessage(
				"event",
				"You built a pier, and can now assign fishermen."
			);
		},
	}),
	new Upgrade({
		name: "Extend the pier",
		description: "A longer pier gives access to bigger fish.",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 4,
		once: false,
		scaling: 4,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.levels.pier += 1;
			game.logMessage(
				"event",
				"Your fishermen can now catch bigger fish."
			);
		},
	}),
	new Upgrade({
		name: "Build a quarry",
		description:
			"Prepare a spot on the cliff for your villagers to mine for stone.",
		type: "craft",
		cost: {
			wood: 200,
		},
		duration: 5,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.unlock("stone");
			game.unlock("miner");
			game.logMessage(
				"event",
				"You built a quarry, and can now assign miners."
			);
			game.levels.quarry += 1;
		},
	}),
	new Upgrade({
		name: "Develop the quarry",
		description: "Make more of the cliff surface available for mining.",
		type: "craft",
		cost: {
			wood: 400,
			stone: 100,
		},
		duration: 5,
		once: false,
		scaling: 4,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.quarry += 1;
			game.production.miner *= 1.5;
			game.logMessage("event", "Your quarry is now more efficient.");
		},
	}),
	new Upgrade({
		name: "Build a smithy",
		description: "Assign blacksmiths to help you complete crafts faster.",
		type: "craft",
		cost: {
			wood: 200,
			stone: 400,
		},
		duration: 6,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.smithy += 1;
			game.unlock("blacksmith");
			game.unlock("craftSpeed");
			game.logMessage("event", "You built a smithy! Nice!");
		},
	}),
	new Upgrade({
		name: "Modernize the smithy",
		description: "Get some new tools to make your blacksmiths happier.",
		type: "craft",
		cost: {
			wood: 100,
			stone: 1000,
		},
		duration: 6,
		once: false,
		scaling: 4,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.levels.smithy += 1;
			game.production.blacksmith *= 0.75;
			game.logMessage(
				"event",
				"Your blacksmiths will now be even more helpful."
			);
		},
	}),
	new Upgrade({
		name: "Build an academy",
		description:
			"Educate your village population to help them with all aspects of life and work.",
		type: "craft",
		cost: {
			wood: 500,
			stone: 2000,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.levels.academy += 1;
			game.unlock("professor");
			game.unlock("research");
			game.unlock("researchSpeed");
			game.logMessage(
				"event",
				"Your academy is now standing, towering above all except the monolith."
			);
		},
	}),
	new Upgrade({
		name: "Grow the academy",
		description: "Build new classrooms to advance your knowledge.",
		type: "craft",
		cost: {
			wood: 1000,
			stone: 4000,
		},
		duration: 10,
		once: false,
		scaling: 4,
		requirement: ["academy", 1],
		effect: function (game) {
			game.levels.academy += 1;
			game.production.professor *= 0.75;
			game.logMessage(
				"event",
				"You add another floor to the already imposing academy building."
			);
		},
	}),
	new Upgrade({
		name: "Mentorship program",
		description: "What if you got one person to oversee another?",
		type: "research",
		cost: {
			food: 4000,
		},
		duration: 6,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.mentorUnlocked = true;
			game.unlock("mentor");
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
		cost: {
			food: 10000,
		},
		duration: 30,
		once: true,
		requirement: ["academy", 3],
		effect: function (game) {
			game.managerUnlocked = true;
			game.unlock("manager");
			game.logMessage(
				"event",
				"You can now assign chaos controllers! Also known as managers."
			);
		},
	}),

	// Job upgrades
	new Upgrade({
		name: "Craft wooden axes",
		description:
			"Your lumberjacks will be happy they don't have to use their bare fists anymore.",
		type: "craft",
		cost: {
			wood: 40,
		},
		duration: 3,
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
	new Upgrade({
		name: "Craft wooden fishing rods",
		description:
			"Flailing your arms about in the water might not have been very effective.",
		type: "craft",
		cost: {
			wood: 100,
		},
		duration: 3,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.logMessage(
				"event",
				"Your fishermen can now sit back and observe the lure. Handy."
			);
		},
	}),

	// Random upgrades
	new Upgrade({
		name: "Hunt down local wildlife",
		description: "Catch the local fluffy bunny population for some food.",
		type: "craft",
		cost: {
			wood: 5,
			food: 5,
		},
		duration: 2,
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
	new Upgrade({
		name: "Fell a great oak",
		description:
			"Chop down the largest tree you can find to boost your supplies.",
		type: "craft",
		cost: {
			wood: 20,
		},
		duration: 4,
		once: true,
		requirement: ["pier", 1],
		effect: function (game) {
			game.wood += 100;
			game.logMessage(
				"event",
				"A majestic oak, providing shade and solace to warriors and lovers alike, is the latest victim of your expansion."
			);
		},
	}),
];

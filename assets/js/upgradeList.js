// upgradeList.js
// Holds the upgrade schema, as well as definitions of all of the game's upgrades
// Includes the upgrades' effects as callbacks

"use strict";

class Upgrade {
	constructor(params = {}) {
		this.name = params?.name; // Primary text, shown as header
		this.description = params?.description; // Secondary text, shown as paragraph
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // An object with at least one of the keys "wood", "food", "stone"
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Optional if once=true. If once=false, cost is multiplied by this amount every completion
		this.requirement = params?.requirement; // Optional, array of Game.levels fields and their minimum values for the upgrade to show up
		this.effect = params?.effect; // Function to run on buy
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
		scaling: 1.5,
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
		description: "Construct a pier for your villagers to fish from.",
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
			game.production.fisherman *= 2;
			game.levels.pier += 1;
			game.logMessage(
				"event",
				"Your fishermen can now catch bigger fish."
			);
		},
	}),
	new Upgrade({
		name: "Build a quarry",
		description: "Dig into the mountainside to mine for stone.",
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
		description: "Add another tunnel to reach new stone veins.",
		type: "craft",
		cost: {
			wood: 250,
			stone: 100,
		},
		duration: 5,
		once: false,
		scaling: 4,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.levels.quarry += 1;
			game.production.miner *= 2;
			game.logMessage("event", "Your quarry now reaches deeper.");
		},
	}),
	new Upgrade({
		name: "Build a smithy",
		description: "Assign blacksmiths to help you complete crafts faster.",
		type: "craft",
		cost: {
			wood: 200,
			stone: 200,
		},
		duration: 6,
		once: true,
		requirement: ["quarry", 2],
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
			wood: 400,
			stone: 400,
		},
		duration: 6,
		once: false,
		scaling: 2,
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
			"Dedicate some village space towards all kinds of research.",
		type: "craft",
		cost: {
			wood: 1000,
			stone: 1000,
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
				"Your academy is now open. What will you learn?"
			);
		},
	}),
	new Upgrade({
		name: "Grow the academy",
		description: "Advance your knowledge in new fields.",
		type: "craft",
		cost: {
			wood: 1500,
			stone: 2000,
		},
		duration: 10,
		once: false,
		scaling: 2,
		requirement: ["academy", 1],
		effect: function (game) {
			game.levels.academy += 1;
			game.production.professor *= 0.75;
			game.logMessage(
				"event",
				"You expand your understanding of the world."
			);
		},
	}),
	new Upgrade({
		name: "Mentorship program",
		description: "What if you got one person to oversee another?",
		type: "research",
		cost: {
			food: 1500,
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
			food: 6000,
		},
		duration: 12,
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
			game.production.lumberjack *= 1.75;
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
			game.production.fisherman *= 1.75;
			game.logMessage(
				"event",
				"Your fishermen can now sit back and observe the lure. Handy."
			);
		},
	}),
	new Upgrade({
		name: "Craft wooden pickaxes",
		description:
			"Not the best idea in the world, but it gets the job done. Somewhat.",
		type: "craft",
		cost: {
			wood: 120,
		},
		duration: 3,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"Equipped with pickaxes, your miners don't have to settle on scavenging whatever rocks are scattered around the place."
			);
		},
	}),
	new Upgrade({
		name: "Craft stone axes",
		description: "Chop down trees with something tougher than themselves.",
		type: "craft",
		cost: {
			wood: 20,
			stone: 50,
		},
		duration: 4,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.production.lumberjack *= 1.75;
			game.logMessage(
				"event",
				"Stone axes are go. Look at all them trees fall!"
			);
		},
	}),
	new Upgrade({
		name: "Craft stone pickaxes",
		description: "Breaking rocks with style.",
		type: "craft",
		cost: {
			wood: 50,
			stone: 100,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.production.miner *= 1.75;
			game.logMessage(
				"event",
				"Your miners are boldly entering the stone age."
			);
		},
	}),
	new Upgrade({
		name: "Sharpen the pickaxes",
		description: "Rocks break faster with pointier tools.",
		type: "craft",
		cost: {
			wood: 60,
			stone: 120,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.miner *= 1.25;
			game.logMessage(
				"event",
				"After a brief period of adjustment, your miners figured out which end of the pickaxe to stick in the rocks."
			);
		},
	}),
	new Upgrade({
		name: "Comfortable stools",
		description: "Your fishermen are tired of standing around.",
		type: "craft",
		cost: {
			wood: 160,
			stone: 40,
		},
		duration: 8,
		once: true,
		requirement: ["smithy", 1],
		effect: function (game) {
			game.production.fisherman *= 1.25;
			game.logMessage(
				"event",
				"You hear a loud cheer of joy as your fishermen are given hard stone chairs, the best they've ever used."
			);
		},
	}),
	new Upgrade({
		name: "Log storage",
		description: "Put your wood in standardized boxes.",
		type: "craft",
		cost: {
			wood: 200,
			stone: 120,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.lumberjack *= 1.25;
			game.logMessage(
				"event",
				`The blacksmith committee has decided on a standard measurement of length -
				this arbitrary tree is the length of "1 log". Lumberjacks now have an easier time
				carrying and storing wood.`
			);
		},
	}),
	new Upgrade({
		name: "Multi-level quarry",
		description: "Expand your quarry vertically.",
		type: "craft",
		cost: {
			wood: 400,
			stone: 100,
		},
		duration: 10,
		once: true,
		requirement: ["smithy", 2],
		effect: function (game) {
			game.production.miner *= 1.5;
			game.logMessage(
				"event",
				"A deeper quarry means more stone to mine. Demand for canaries increases."
			);
		},
	}),
	new Upgrade({
		name: "Fish traps",
		description: "Construct cunning traps to get fish to catch themselves.",
		type: "craft",
		cost: {
			wood: 500,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.fisherman *= 1.5;
			game.logMessage(
				"event",
				"With fish traps, your fishermen are now fishing twice at the same time."
			);
		},
	}),
	new Upgrade({
		name: "Back supports",
		description: "Your lumberjacks' backs hurt from all the swinging.",
		type: "craft",
		cost: {
			wood: 300,
			stone: 300,
		},
		duration: 12,
		once: true,
		requirement: ["smithy", 3],
		effect: function (game) {
			game.production.lumberjack * 1.75;
			game.logMessage(
				"event",
				"Equipped with back supports, your lumberjacks are like tree-cutting machines."
			);
		},
	}),
	new Upgrade({
		name: "Time management",
		description:
			"Help blacksmiths and professors manage their workday more efficiently.",
		type: "research",
		cost: {
			food: 2000,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.blacksmith -= 0.05;
			game.production.professor -= 0.05;
			game.logMessage(
				"event",
				"Writing up a schedule helps your blacksmiths and professors realize how much time they have been wasting."
			);
		},
	}),
	new Upgrade({
		name: "Swing smarter, not harder",
		description:
			"A lumberjack course for maximizing your results with the same effort.",
		type: "research",
		cost: {
			food: 600,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.production.lumberjack *= 2;
			game.logMessage(
				"event",
				"Your lumberjacks are a lot better at tree-cutting. They also seem to have formed a union."
			);
		},
	}),
	new Upgrade({
		name: "Task mastery",
		description: "Your mentors are good, but they could be better.",
		type: "research",
		cost: {
			food: 3000,
		},
		duration: 16,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.production.mentorBoost += 0.1;
			game.logMessage(
				"event",
				"After doing the same thing over and over for long enough, your mentors got better at their job."
			);
		},
	}),

	// Story upgrades
	new Upgrade({
		name: "Survey the monolith",
		description:
			"The black shape towers over all. It compels you to examine it.",
		type: "craft",
		cost: {
			food: 50,
		},
		duration: 60,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.showStory(
				`You assemble a survey party, and venture out towards the monolith.
				It takes you a few days just to reach it, a testament to how much
				larger it is than it appeared to be from a distance. You are lucky
				you prepared plenty of food. Once you arrive, it is as if reality
				stops at the structure's border. It has the color of having your eyes
				closed, which unsettles you deeply, and you try to look away whenever
				possible. To the touch, its surface is perfectly smooth and cannot be
				chipped with any tools at your disposal. What is it? Why is it here?
				The questions remain unanswered, and your party heads back home.`,
				"Return"
			);
		},
	}),
	new Upgrade({
		name: "Study the monolith",
		description: "Ask your scholars to examine the distant structure.",
		type: "research",
		cost: {
			food: 800,
		},
		duration: 240,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.showStory(
				`You gather the finest minds of your village and venture towards the
				monolith once again. Their measuring instruments reveal a worrying
				result. The monolith reads as having the temperature of millions
				of degrees, despite being pleasantly cool to the touch. All other
				measurements fail, resulting in either zero or a value far beyond
				the scale. By all means, this object should not exist in your reality,
				let alone have the stability to stand there, ruthless and unchanging.
				Keeping all its energy to itself. How dare it.`,
				"Leave"
			);
		},
	}),
	new Upgrade({
		name: "Destroy the monolith",
		description: "It has plagued the horizon long enough.",
		type: "research",
		cost: {
			wood: 10000,
			food: 30000,
			stone: 50000,
		},
		duration: 1200,
		once: true,
		requirement: ["academy", 4],
		effect: function (game) {
			game.showStory(
				`It's a bright sunny day, and your hand-working villagers wake up and
				head to their place of work, all the while chanting cheerful song.
				But, today is a special day, as this evening the deed will be done.
				As the sun sets, all gather wordlessly and traverse the long narrow
				pathway to the structure. How fortunate that explosives, originally
				invented for mining, can now serve the greatest purpose.`,
				"Advance",
				() => {
					game.showStory(
						`You're closer. Almost there. The horrible, eye-searing display,
						blocking your vision wherever present, growing larger with decreasing
						distance. Once at the threshold, the explosives are set. All is quiet.
						The moment has come. The purpose must be fulfilled. The engineer hands
						you the trigger. He runs, stumbles, and hits his head, splitting it open.
						The joy of the moment proved too much to bear. Not all villagers left
						the explosion area, but there is no time to waste.`,
						"Trigger",
						() => {
							game.showStory(
								`Shower of particles. Dust rises, then falls. Tendrils made
								of monolith. They split, merge, charge, rejoin. It is angry.
								There is damage. We have succeeded. One by one, thrust through
								the heart. Thank you, Gareth. Goodbye, Kate. I'm so happy.
								We have done it, together. Tendrils, now coordinated. Grabbing
								my friends. Pulling them inside, where space stops. It is no
								matter. We are but a cog in the great plan. Horrible, unbearable
								pain. I'm so happy. What we started, others will finish. It's
								taking me now. Infinite blackness. It is damaged, floods out.
								Other villages will appear. Time stops, there is now only thought.
								Others will damage further. The great work will be done.
								The monolith must fall. The monolith must fall.`,
								"Join",
								() => {
									game.gameOver();
								}
							);
						}
					);
				}
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
	new Upgrade({
		name: "Level the ground",
		description:
			"The village is built on rather uneven ground. Maybe our miners can help with that.",
		type: "craft",
		cost: {
			stone: 20,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 1],
		effect: function (game) {
			game.stone += 120;
			game.logMessage(
				"event",
				"The village is now flatter than ever! Alright guys, you can carry the buildings back in."
			);
		},
	}),
	new Upgrade({
		name: "Fish out the monster of the deep",
		description:
			"A fish of enormous proportions has been terrorizing the population.",
		type: "craft",
		cost: {
			food: 40,
		},
		duration: 5,
		once: true,
		requirement: ["quarry", 2],
		effect: function (game) {
			game.food += 200;
			game.logMessage(
				"event",
				"The monster of the deep has been put to rest. The waters are safe once more. It also happened to be quite delicious."
			);
		},
	}),
	new Upgrade({
		name: "Exploration basics",
		description:
			"Teach your villagers how to survive in the wild in their free time. Maybe they'll find something?",
		type: "research",
		cost: {
			wood: 50,
			stone: 50,
			food: 100,
		},
		duration: 10,
		once: true,
		requirement: ["academy", 1],
		effect: function (game) {
			game.wood += 1000;
			game.stone += 1000;
			game.logMessage(
				"event",
				"Your villagers went on an adventure last weekend. They found an abandoned camp, full of supplies! All the food was rotten, though."
			);
		},
	}),
	new Upgrade({
		name: "Foreign customs",
		description:
			"Learn how to communicate with a friendly tribe minding their business nearby.",
		type: "research",
		cost: {
			food: 400,
		},
		duration: 15,
		once: true,
		requirement: ["academy", 2],
		effect: function (game) {
			game.wood += 1600;
			game.stone += 1600;
			game.food += 800;
			game.logMessage(
				"event",
				"The friendly tribe agreed to barter! They happily accepted a bunch of random trinkets, and offered tons of supplies in return."
			);
		},
	}),
];

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
		this.smithyLvl = 0;
		this.academyLvl = 0;
		this.mentorUnlocked = false;
		this.managerUnlocked = false;

		// Chaos levels
		this.pierChaos = 0;
		this.quarryChaos = 0;
		this.smithyChaos = 0;
		this.academyChaos = 0;

		// Assignments
		this.lumberjack = 0;
		this.fisherman = {
			villager: 0,
			mentor: 0,
			manager: 0,
		};
		this.miner = {
			villager: 0,
			mentor: 0,
			manager: 0,
		};
		this.blacksmith = {
			villager: 0,
			mentor: 0,
			manager: 0,
		};
		this.professor = {
			villager: 0,
			mentor: 0,
			manager: 0,
		};

		// Balance and content
		this.production = {
			lumberjack: 0.001,
			fisherman: 0.001,
			miner: 0.001,
			blacksmith: 0.6,
			professor: 0.6,
			mentorBoost: 1.5,
			managerReduction: 0.2,
		};
		this.upgrades = this.createUpgrades();

		// Tutorial flags
		this.resourcePopupShown = false;
		this.tentPopupShown = false;
		this.assignPopupShown = false;
		this.pierPopupShown = false;
		this.chaosPopupShown = false;
		this.stonePopupShown = false;
		this.smithyPopupShown = false;
		this.academyPopupShown = false;
		this.mentorPopupShown = false;
		this.managerPopupShown = false;

		// Register button clicks
		this.dom.gatherWood.addEventListener("click", this.gatherWood);
		this.dom.gatherFood.addEventListener("click", this.gatherFood);

		let jobs = ["fisherman", "miner", "blacksmith", "professor"];
		let roles = ["villager", "mentor", "manager"];
		for (let job of jobs) {
			for (let role of roles) {
				let roleCap = role[0].toUpperCase() + role.slice(1);
				this.dom[job + roleCap + "Up"].addEventListener("click", () => {
					this.assign(job, role);
				});
				this.dom[job + roleCap + "Down"].addEventListener("click", () => {
					this.unassign(job, role);
				});
			}
		}

		this.dom.popupDismiss.addEventListener("click", () => {
			this.dom.popupShroud.style.display = "none";
		});

		// Add upgrades to the DOM
		for (let upgrade of this.upgrades) {
			if (upgrade.type == "craft")
				this.dom.craftTab.appendChild(upgrade.createElement(this));
			else this.dom.researchTab.appendChild(upgrade.createElement(this));
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
			disembark. It's time to begin work on your settlement.`
		);
		this.logMessage("info", "Welcome to Village of Chaos!");
		this.showPopup(
			`Welcome to Village of Chaos! In this game you will collect
			resources, invite villagers and build new structures. To start
			with, use these buttons to collect 10 units of food and wood,
			allowing you to build a tent for your first villagers.`,
			"#gathering"
		);
	}

	createUpgrades() {
		return [
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
					this.description =
						"Add another bed to fit in an extra villager.";
					if (game.tentLvl === 0) {
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
					if (game.pierLvl === 0) {
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
					this.name = "Develop the quarry";
					this.description =
						"Make more of the cliff surface available for mining.";
					if (game.quarryLvl === 0) {
						game.logMessage(
							"event",
							"You built a quarry, and can now assign miners."
						);
						game.showElement("stone");
						game.showElement("miner");
					} else {
						game.logMessage(
							"event",
							"Your quarry is now more efficient."
						);
					}
					game.quarryLvl += 1;
					if (game.quarryLvl > 1) game.production.miner *= 1.5;
				},
			}),
			new Upgrade({
				name: "Build a smithy",
				description:
					"Unlock new upgrades, and assign blacksmiths to help you complete upgrades faster.",
				type: "craft",
				cost: [0, 100, 100],
				duration: 4,
				once: false,
				scaling: 2.5,
				requirement: function (game) {
					return game.quarryLvl >= 1 ? true : false;
				},
				effect: function (game) {
					this.name = "Modernize the smithy";
					this.description =
						"Get some new tools to unlock new upgrades and make them even faster to complete.";
					if (game.smithyLvl === 0) {
						game.logMessage("event", "You built a smithy! Nice!");
						game.showElement("blacksmith");
						game.showElement("craft-speed");
					} else {
						game.logMessage(
							"event",
							"Your blacksmiths will now be even more helpful."
						);
					}
					game.smithyLvl += 1;
					if (game.smithyLvl > 1) game.production.blacksmith *= 0.6;
				},
			}),
			new Upgrade({
				name: "Build an academy",
				description:
					"Unlock research into team management techniques, and assign professors to help speed it up.",
				type: "craft",
				cost: [0, 500, 500],
				duration: 10,
				once: false,
				scaling: 2.5,
				requirement: function (game) {
					return game.smithyLvl >= 3 ? true : false;
				},
				effect: function (game) {
					this.name = "Grow the academy";
					this.description =
						"Develop new teaching aids to discover new techniques and improve existing ones.";
					if (game.academyLvl === 0) {
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
					game.academyLvl += 1;
					if (game.academyLvl > 1) game.production.professor *= 0.6;
				},
			}),
			new Upgrade({
				name: "Mentorship program",
				description: "What if you got one person to oversee another?",
				type: "research",
				cost: [400, 10, 2],
				duration: 6,
				once: true,
				requirement: function (game) {
					return game.academyLvl >= 1 ? true : false;
				},
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
				description:
					"Instead of working, make sure others are working.",
				type: "research",
				cost: [2000, 20, 10],
				duration: 20,
				once: true,
				requirement: function (game) {
					return game.academyLvl >= 3 ? true : false;
				},
				effect: function (game) {
					game.showElement("manager");
					game.managerUnlocked = true;
					game.logMessage(
						"event",
						"You can now assign chaos controllers! Also known as managers."
					);
				},
			}),
		];
	}

	update(dt) {
		// Update upgrade state and progress
		for (let upgrade of this.upgrades) upgrade.update(game, dt);

		// Update chaos levels
		this.pierChaos = this.getChaosLevel(this.fisherman);
		this.quarryChaos = this.getChaosLevel(this.miner);
		this.smithyChaos = this.getChaosLevel(this.blacksmith);
		this.academyChaos = this.getChaosLevel(this.professor);

		// Generate resources
		this.wood += dt * this.getWoodProduction();
		this.food += dt * this.getFoodProduction();
		this.stone += dt * this.getStoneProduction();

		// Show tutorial pop-ups
		if (this.wood >= 4 && !this.resourcePopupShown) {
			this.showPopup(
				`Your current resource count is shown here.`,
				"header"
			);
			this.resourcePopupShown = true;
		}
		if (this.wood >= 10 && this.food >= 10 && !this.tentPopupShown) {
			this.showPopup(
				`Not bad! You now have enough resources to build your first
				tent. This will invite two villagers to your village. They will
				be automatically employed as lumberjacks, producing wood for
				you over time. Click on "Build a tent" in the upgrade list to
				begin the craft.`,
				"#craft-tab"
			);
			this.tentPopupShown = true;
		}
		if (this.tentLvl >= 1 && !this.assignPopupShown) {
			document.getElementById("assign").click();
			this.showPopup(
				`Now that you have a tent, your village consists of two
				lumberjacks, which you can see in the newly unlocked "Assign"
				tab. Click on the "Craft" tab to get back to your list of
				available upgrades, and let's see if you can manage to build a
				fishing pier.`,
				"#interface"
			);
			this.assignPopupShown = true;
		}
		if (this.pierLvl >= 1 && !this.pierPopupShown) {
			document.getElementById("assign").click();
			this.showPopup(
				`With the fishing pier built, you can now assign some of your
				villagers to be fishermen, producing food over time. Use the
				"+" and "-" buttons to change your assignments. Any unassigned
				villagers will still gather wood for you.`,
				"#assign-tab"
			);
			this.pierPopupShown = true;
		}
		if (this.pierChaos > 0 && !this.chaosPopupShown) {
			this.showPopup(
				`Uh oh! With two villagers both taking care of the pier, it
				seems like they tend to step on each other's toes. The more
				villagers you assign to do the same job, the more chaotic their
				workplace becomes, and production slows down. You can see the
				slowdown factor in the "Chaos" column. Try to minimize this to
				make the most of your village.`,
				"#assign-tab"
			);
			this.chaosPopupShown = true;
		}
		if (this.quarryLvl >= 1 && !this.stonePopupShown) {
			this.showPopup(
				`With the construction of the quarry, you unlocked a new kind
				of resource! Assign miners to start gathering stone. You might
				also discover new crafts if you upgrade your existing buildings
				enough...`,
				"header"
			);
			this.stonePopupShown = true;
		}
		if (this.smithyLvl >= 1 && !this.smithyPopupShown) {
			this.showPopup(
				`Have you noticed that crafts are taking longer and longer to
				build? Assign blacksmiths to help you with your crafts,
				speeding up their creation significantly. The speed-up factor
				is shown next to your resource count.`,
				"header"
			);
			this.smithyPopupShown = true;
		}
		if (this.academyLvl >= 1 && !this.academyPopupShown) {
			document.getElementById("research").click();
			this.showPopup(
				`The academy is now standing! A brand new kind of upgrade has
				been unlocked - researches, which you can access via the new
				"Research" tab. You can now also assign professors who will
				speed up research progress, similarly to how blacksmiths speed
				up crafts.`,
				"#interface"
			);
			this.academyPopupShown = true;
		}
		if (this.mentorUnlocked && !this.mentorPopupShown) {
			document.getElementById("assign").click();
			this.showPopup(
				`Congratulations, you can now assign mentors to each job!
				Mentors are not only better at production than regular
				villagers, but they can also take on a villager as an
				apprentice. Each pair of mentor and villager will count as only
				one person for the purposes of Chaos, helping you to make your
				workplaces bigger without inviting mismanagement.`,
				"#assign-tab"
			);
			this.mentorPopupShown = true;
		}
		if (this.managerUnlocked && !this.managerPopupShown) {
			document.getElementById("assign").click();
			this.showPopup(
				`This is it - the cutting edge of team management. With
				managers on your teams, your production will be higher than
				ever before! Sure, managers don't actually produce anything,
				but the more of them you have, the lower your Chaos becomes.
				The sky's the limit! Soon, maybe you will be able to
				investigate that monolith on the horizon...`,
				"#assign-tab"
			);
			this.managerPopupShown = true;
		}
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
		this.dom.craftSpeed.textContent = (1 / this.getCraftSpeedup()).toFixed(
			1
		);
		this.dom.researchSpeed.textContent = (
			1 / this.getResearchSpeedup()
		).toFixed(1);

		// Update assignment counts
		this.dom.lumberjack.textContent = this.lumberjack;
		this.dom.fishermanVillager.textContent = this.fisherman.villager;
		this.dom.minerVillager.textContent = this.miner.villager;
		this.dom.blacksmithVillager.textContent = this.blacksmith.villager;
		this.dom.professorVillager.textContent = this.professor.villager;
		this.dom.fishermanMentor.textContent = this.fisherman.mentor;
		this.dom.minerMentor.textContent = this.miner.mentor;
		this.dom.blacksmithMentor.textContent = this.blacksmith.mentor;
		this.dom.professorMentor.textContent = this.professor.mentor;
		this.dom.fishermanManager.textContent = this.fisherman.manager;
		this.dom.minerManager.textContent = this.miner.manager;
		this.dom.blacksmithManager.textContent = this.blacksmith.manager;
		this.dom.professorManager.textContent = this.professor.manager;

		// Update chaos indicators
		this.dom.pierChaos.textContent = Math.ceil(this.pierChaos * 100);
		this.dom.quarryChaos.textContent = Math.ceil(this.quarryChaos * 100);
		this.dom.smithyChaos.textContent = Math.ceil(this.smithyChaos * 100);
		this.dom.academyChaos.textContent = Math.ceil(this.academyChaos * 100);
	}

	logMessage(type, msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		el.classList.add(type);
		this.dom.log.prepend(el); // Prepend instead of append because of flexbox direction
	}

	getWoodProduction() {
		return this.production.lumberjack * this.lumberjack;
	}

	getFoodProduction() {
		let contribution =
			this.fisherman.villager +
			this.fisherman.mentor * this.production.mentorBoost;
		return contribution * this.production.fisherman * (1 - this.pierChaos);
	}

	getStoneProduction() {
		let contribution =
			this.miner.villager +
			this.miner.mentor * this.production.mentorBoost;
		return this.production.miner * contribution * (1 - this.quarryChaos);
	}

	getCraftSpeedup() {
		let contribution =
			this.blacksmith.villager +
			this.blacksmith.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.blacksmith ** contribution) *
				(1 - this.smithyChaos)
		);
	}

	getResearchSpeedup() {
		let contribution =
			this.professor.villager +
			this.professor.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.professor ** contribution) *
				(1 - this.academyChaos)
		);
	}

	getChaosLevel(job) {
		let unpairedVillagers = Math.max(job.villager - job.mentor, 0);
		let penalty = job.mentor + unpairedVillagers - 1;
		penalty *= this.production.managerReduction ** job.manager;
		return Math.max(1 - 0.8 ** penalty, 0);
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};

	assign(job, role) {
		if (this.lumberjack == 0) return;
		this.lumberjack -= 1;
		this[job][role] += 1;
		if (this[job][role] >= 2) game.showElement("chaos");
	}

	unassign(job, role) {
		if (this[job][role] == 0) return;
		this[job][role] -= 1;
		this.lumberjack += 1;
	}

	showElement(name) {
		let display = "block";
		if (["fisherman", "miner", "blacksmith", "professor"].includes(name))
			display = "table-row";
		if (["mentor", "manager", "chaos"].includes(name))
			display = "table-cell";
		document.body.style.setProperty(`--${name}-display`, display);
	}

	showPopup(text, atSelector) {
		this.dom.popupShroud.style.display = "block";
		this.dom.popupText.textContent = text;

		if (atSelector) {
			let target = document.querySelector(atSelector);
			let rect = target.getBoundingClientRect();

			this.dom.popup.style.left = rect.left + "px";
			let margin = parseInt(
				window.getComputedStyle(this.dom.popup).marginTop
			);
			let top = rect.top - this.dom.popup.offsetHeight - margin * 2;
			if (top < 0)
				// If pop-up ended up off-screen, position below the target instead of above
				top = rect.bottom;
			this.dom.popup.style.top = top + "px";

			target.style.zIndex = 1000; // Bring above the shroud
			target.style.pointerEvents = "none"; // Make sure target can't be interacted with while pop-up is visible
			this.dom.popupDismiss.addEventListener("click", () => {
				target.style.zIndex = "revert";
				target.style.pointerEvents = "revert";
			});
		} else {
			// Default - just center it
			this.dom.popup.style.left =
				window.innerWidth / 2 - this.dom.popup.offsetWidth / 2 + "px";
			this.dom.popup.style.top =
				window.innerHeight / 2 - this.dom.popup.offsetHeight / 2 + "px";
		}
	}
}

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
		this.levels = {
			tent: 0,
			pier: 0,
			quarry: 0,
			smithy: 0,
			academy: 0,
		};
		this.chaos = {
			pier: 0,
			quarry: 0,
			smithy: 0,
			academy: 0,
		};

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

		// Balance
		this.production = {
			lumberjack: 0.001,
			fisherman: 0.001,
			miner: 0.001,
			blacksmith: 0.75,
			professor: 0.75,
			mentorBoost: 1.5,
			managerReduction: 0.2,
		};

		// Unlocks
		this.upgrades = [];
		for (let upgrade of this.upgradeList) {
			this.upgrades.push({
				visible: false, // Is requirement met?
				available: false, // Is there enough currency?
				started: false, // Has the user clicked it?
				progress: 0, // Advances towards 1.0 over time if started
				completed: 0, // 0 or 1 for one-time upgrades, can be above 1 for repeatable upgrades
			});
		}
		this.renderUpgrades();
		this.unlocks = {
			income: false,
			stone: false,
			craftSpeed: false,
			researchSpeed: false,
			assign: false,
			research: false,
			chaos: false,
			mentor: false,
			manager: false,
			fisherman: false,
			blacksmith: false,
			miner: false,
			professor: false,
		};

		// List of fields which are held in local storage
		this.serializable = [
			"wood",
			"food",
			"stone",
			"levels",
			"unlocks",
			"lumberjack",
			"fisherman",
			"miner",
			"blacksmith",
			"professor",
			"production",
			"upgrades",
			"tutorial",
		];

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
				this.dom[job + roleCap + "Down"].addEventListener(
					"click",
					() => {
						this.unassign(job, role);
					}
				);
			}
		}

		this.dom.popupDismiss.addEventListener("click", () => {
			this.dom.popupShroud.style.display = "none";
		});

		this.dom.save.addEventListener("click", () => {
			this.save();
		});
		this.dom.load.addEventListener("click", () => {
			this.load();
		});
		this.dom.reset.addEventListener("click", () => {
			if (
				window.confirm(
					`Are you sure you want to reset your game? Your progress
					will be lost forever, and this is irreversible.`
				)
			)
				this.reset();
		});

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

		// Load savefile if exists, and save the game periodically
		this.load();
		setInterval(() => {
			this.save();
		}, 1000 * 60 * 5); // 5 minutes
	}

	update(dt) {
		this.updateUpgrades(dt);

		// Update chaos levels
		this.chaos.pier = this.getChaosLevel(this.fisherman);
		this.chaos.quarry = this.getChaosLevel(this.miner);
		this.chaos.smithy = this.getChaosLevel(this.blacksmith);
		this.chaos.academy = this.getChaosLevel(this.professor);

		// Generate resources
		this.wood += dt * this.getWoodProduction();
		this.food += dt * this.getFoodProduction();
		this.stone += dt * this.getStoneProduction();

		this.displayPopups(); // Defined in tutorial.js
	}

	updateUpgrades(dt) {
		for (let i in this.upgradeList) {
			if (!this.dom.upgrades[i]) continue;

			// Update available state
			this.upgrades[i].available =
				this.canAffordUpgrade(i) && !this.upgrades[i].started
					? true
					: false;
			if (this.canAffordUpgrade(i) || this.upgrades[i].started)
				this.dom.upgrades[i].classList.remove("inactive");
			else this.dom.upgrades[i].classList.add("inactive");

			// Advance progress
			if (this.upgrades[i].started) {
				let speedup =
					this.upgradeList[i].type == "craft"
						? this.getCraftSpeedup()
						: this.getResearchSpeedup();
				this.upgrades[i].progress +=
					dt / (this.upgradeList[i].duration * 1000 * speedup);
				if (this.upgrades[i].progress >= 1) {
					this.completeUpgrade(i);
				} else {
					// Upgrade advanced but not completed, update the progress bar
					this.dom.upgrades[i].style.setProperty(
						"--progress",
						this.upgrades[i].progress * 100 + "%"
					);
				}
			}
		}
	}

	getUpgradeCost(i) {
		let cost = { ...this.upgradeList[i].cost };
		let scaling = this.upgradeList[i].scaling ?? 1;
		let costFactor = scaling ** this.upgrades[i].completed;
		for (let i in cost) cost[i] = Math.ceil(cost[i] * costFactor);
		return cost;
	}

	canAffordUpgrade(i) {
		let cost = this.getUpgradeCost(i);
		if (
			(cost.wood ?? 0) <= this.wood &&
			(cost.food ?? 0) <= this.food &&
			(cost.stone ?? 0) <= this.stone
		)
			return true;
		return false;
	}

	upgradeRequirementMet(i) {
		if (!this.upgradeList[i].requirement) return true; // No requirement
		if (
			this.levels[this.upgradeList[i].requirement[0]] >=
			this.upgradeList[i].requirement[1]
		)
			return true;
		return false;
	}

	upgradeClicked(i) {
		// Is it affordable?
		if (!this.upgrades[i].available) return;

		// Pay the cost and begin
		let cost = this.getUpgradeCost(i);
		this.wood -= cost.wood ?? 0;
		this.food -= cost.food ?? 0;
		this.stone -= cost.stone ?? 0;
		this.upgrades[i].started = true;
	}

	completeUpgrade(i) {
		// Perform upgrade effect and update upgrade state
		this.upgradeList[i].effect(this);
		this.upgrades[i].completed += 1;
		this.upgrades[i].started = false;
		this.upgrades[i].progress = 0;

		// Other upgrades might've been affected; refresh everything
		this.renderUpgrades();
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
		this.dom.pierChaos.textContent = Math.ceil(this.chaos.pier * 100);
		this.dom.quarryChaos.textContent = Math.ceil(this.chaos.quarry * 100);
		this.dom.smithyChaos.textContent = Math.ceil(this.chaos.smithy * 100);
		this.dom.academyChaos.textContent = Math.ceil(this.chaos.academy * 100);

		// Make sure world display is sized correctly
		let smallerDim = Math.min(window.innerWidth, window.innerHeight);
		this.dom.world.style.setProperty("--scale", smallerDim / 640);
	}

	renderUpgrades() {
		// Clean up
		this.dom.craftTab.replaceChildren();
		this.dom.researchTab.replaceChildren();
		this.dom.upgrades.length = 0;

		// Update requirements
		for (let i in this.upgradeList)
			this.upgrades[i].visible = this.upgradeRequirementMet(i);

		// Generate upgrade tabs' DOM
		for (let i in this.upgradeList) {
			let upgrade = this.upgrades[i];

			// Is it shown at all?
			if (
				!upgrade.visible ||
				(this.upgradeList[i].once && this.upgrades[i].completed >= 1)
			) {
				this.dom.upgrades.push(null);
				continue;
			}

			// Generate the upgrade in the correct tab
			let el = this.createUpgradeElement(i);
			el.addEventListener("click", () => {
				this.upgradeClicked(i);
			});
			this.dom.upgrades.push(el);
			if (this.upgradeList[i].type == "craft")
				this.dom.craftTab.appendChild(el);
			else this.dom.researchTab.appendChild(el);
		}
	}

	createUpgradeElement(i) {
		let el = document.createElement("div");
		el.classList.add("upgrade");

		let html = "";
		html += `<h2>${this.upgradeList[i].name}</h2>`;
		html += `<p>${this.upgradeList[i].description}</p>`;
		html += `<p>Cost: `;
		let cost = this.getUpgradeCost(i);
		let atLeastOne = false;
		if (cost.wood) {
			html += `${cost.wood} wood`;
			atLeastOne = true;
		}
		if (cost.food) {
			if (atLeastOne) html += `, `;
			html += `${cost.food} food`;
			atLeastOne = true;
		}
		if (cost.stone) {
			if (atLeastOne) html += `, `;
			html += `${cost.stone} stone`;
		}
		html += `</p>`;
		el.innerHTML = html;
		return el;
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
		return contribution * this.production.fisherman * (1 - this.chaos.pier);
	}

	getStoneProduction() {
		let contribution =
			this.miner.villager +
			this.miner.mentor * this.production.mentorBoost;
		return this.production.miner * contribution * (1 - this.chaos.quarry);
	}

	getCraftSpeedup() {
		let contribution =
			this.blacksmith.villager +
			this.blacksmith.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.blacksmith ** contribution) *
				(1 - this.chaos.smithy)
		);
	}

	getResearchSpeedup() {
		let contribution =
			this.professor.villager +
			this.professor.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.professor ** contribution) *
				(1 - this.chaos.academy)
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
		if (this[job][role] >= 2) game.unlock("chaos");
	}

	unassign(job, role) {
		if (this[job][role] == 0) return;
		this[job][role] -= 1;
		this.lumberjack += 1;
	}

	unlock(name) {
		let display = "block";
		if (["fisherman", "miner", "blacksmith", "professor"].includes(name))
			display = "table-row";
		if (["mentor", "manager", "chaos"].includes(name))
			display = "table-cell";
		if (name === "income")
			display = "inline";
		let nameDashed = Util.kebabCase(name);
		document.body.style.setProperty(`--${nameDashed}-display`, display);
		this.unlocks[name] = true;
	}

	lockEverything() {
		for (let name in this.unlocks) {
			let nameDashed = Util.kebabCase(name);
			document.body.style.setProperty(`--${nameDashed}-display`, "none");
		}
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

	save() {
		let state = {};
		for (let field of this.serializable) state[field] = this[field];
		localStorage.setItem("savegame", JSON.stringify(state));

		this.logMessage("info", "Game saved.");
	}

	load() {
		let state = JSON.parse(localStorage.getItem("savegame"));
		if (!state) return; // Nothing to load
		for (let field of this.serializable) this[field] = state[field];
		this.renderUpgrades();

		// Set unlock state in DOM
		this.lockEverything();
		for (let unlock in this.unlocks)
			if (this.unlocks[unlock]) this.unlock(unlock);

		// Close pop-up if open
		this.dom.popupDismiss.click();

		this.dom.log.replaceChildren(); // We don't restore log entries
		this.logMessage("info", "Game loaded.");
	}

	reset() {
		localStorage.removeItem("savegame");
		window.location.reload();
	}
}

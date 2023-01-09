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
		this.upgrades = this.createUpgrades(); // Defined in upgradeList.js

		// List of fields which are held in local storage
		this.serializable = [
			"wood",
			"food",
			"stone",
			"tentLvl",
			"quarryLvl",
			"smithyLvl",
			"academyLvl",
			"mentorUnlocked",
			"managerUnlocked",
			"lumberjack",
			"fisherman",
			"miner",
			"blacksmith",
			"professor",
			"production",
			"upgrades",
			"resourcePopupShown",
			"tentPopupShown",
			"assignPopupShown",
			"pierPopupShown",
			"chaosPopupShown",
			"stonePopupShown",
			"smithyPopupShown",
			"academyPopupShown",
			"mentorPopupShown",
			"managerPopupShown",
		];

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

		this.refreshUpgrades();

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

		this.displayPopups(); // Defined in tutorial.js
	}

	refreshUpgrades() {
		this.dom.craftTab.replaceChildren();
		this.dom.researchTab.replaceChildren();

		for (let upgrade of this.upgrades) {
			if (upgrade.type == "craft")
				this.dom.craftTab.appendChild(upgrade.createElement(this));
			else this.dom.researchTab.appendChild(upgrade.createElement(this));
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

	save() {
		let state = {};
		for (let field of this.serializable) state[field] = this[field];
		localStorage.setItem("savegame", JSON.stringify(state));
	}

	load() {
		let state = JSON.parse(localStorage.getItem("savegame"));
		if (!state) return; // Nothing to load
		for (let field of this.serializable) this[field] = state[field];
	}
}

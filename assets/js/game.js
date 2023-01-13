// game.js
// Game class. Holds all state, performs updates and renders into the DOM
// State can be loaded/saved via cookies

class Game {
	// dom: An object of DOM class (dom.js)
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
		// Modified by upgrades throughout gameplay
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

		// The upgrades array holds upgrade state, as opposed to upgradeList
		// which is immutable and holds definitions only
		// They are related via array index: upgrade[i] is state of upgradeList[i]
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
		this.renderUpgrades(); // First-time run to populate the DOM
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
		this.dom.assignButton.addEventListener("click", () => {
			this.changeTab("assign");
		});
		this.dom.craftButton.addEventListener("click", () => {
			this.changeTab("craft");
		});
		this.dom.researchButton.addEventListener("click", () => {
			this.changeTab("research");
		});

		this.dom.gatherWood.addEventListener("click", this.gatherWood);
		this.dom.gatherFood.addEventListener("click", this.gatherFood);

		// There are a lot of job assignment buttons. We shorten the code
		// by iterating over all possible combinations
		const jobs = ["fisherman", "miner", "blacksmith", "professor"];
		const roles = ["villager", "mentor", "manager"];
		for (let job of jobs) {
			for (let role of roles) {
				const roleCap = role[0].toUpperCase() + role.slice(1);
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
		this.dom.storyDismiss.addEventListener("click", () => {
			this.dom.storyShroud.style.display = "none";
		});

		this.dom.save.addEventListener("click", () => {
			this.save();
		});
		this.dom.load.addEventListener("click", () => {
			this.load();
		});
		this.dom.reset.addEventListener("click", () => {
			if (
				// window.confirm is safe to use - game loop can deal with the multi-second pause
				window.confirm(
					`Are you sure you want to reset your game? Your progress will be lost forever, and this is irreversible.`
				)
			)
				this.reset();
		});
		this.dom.logExpand.addEventListener("click", () => {
			this.dom.log.classList.toggle("visible");
		});

		// Pre-select a tab
		this.dom.craftButton.click();

		// Load savefile if exists, and save the game periodically
		if (!this.load()) {
			// No savefile - this is a new game, print out some flavor text
			this.showStory(
				`It's a bright sunny day, and you are standing in the middle of a
				forest clearing. To your left is a glistening river full of fish,
				and the nearby mountain promises to provide bountiful building
				material. What attracted you to this place? Was it the prospect
				of escaping the hustle of city life? Or maybe you were curious
				about the giant black structure in the distance? Regardless of
				your reasons, you disembark. It's time to begin your work on
				the settlement.`,
				"Begin"
			);
			this.logMessage("info", "Welcome to Village of Chaos!");
			this.showPopup(
				// Defined in tutorial.js
				`Welcome to Village of Chaos! In this game you will collect
				resources, invite villagers and build new structures. To start
				with, use these buttons to collect 10 units of food and wood,
				allowing you to build a tent for your first villagers.`,
				"#gathering"
			);
		}
		setInterval(() => {
			this.save();
		}, 1000 * 60 * 5); // Autosave every 5 minutes
	}

	// Calculate production and other game logic, run often to keep the game
	// responsive
	// deltaTime: time passed since last call (in milliseconds)
	update(deltaTime) {
		this.updateUpgrades(deltaTime);

		// Update chaos levels
		this.chaos.pier = this.getChaosLevel(this.fisherman);
		this.chaos.quarry = this.getChaosLevel(this.miner);
		this.chaos.smithy = this.getChaosLevel(this.blacksmith);
		this.chaos.academy = this.getChaosLevel(this.professor);

		// Generate resources
		this.wood += deltaTime * this.getWoodProduction();
		this.food += deltaTime * this.getFoodProduction();
		this.stone += deltaTime * this.getStoneProduction();

		this.updatePopups(); // Defined in tutorial.js
	}

	// Update the state of upgrades, run often to keep upgrade tabs responsive
	// deltaTime: time passed since last call (in milliseconds)
	updateUpgrades(deltaTime) {
		for (let i in this.upgradeList) {
			if (!this.dom.upgrades[i]) continue; // Not rendered, skip

			// Update availability state
			this.upgrades[i].available =
				this.canAffordUpgrade(i) && !this.upgrades[i].started
					? true
					: false;
			if (this.canAffordUpgrade(i) || this.upgrades[i].started)
				this.dom.upgrades[i].classList.remove("inactive");
			else this.dom.upgrades[i].classList.add("inactive");

			// Advance progress if started
			if (this.upgrades[i].started) {
				const speedup =
					this.upgradeList[i].type == "craft"
						? this.getCraftSpeedup()
						: this.getResearchSpeedup();
				this.upgrades[i].progress +=
					deltaTime / (this.upgradeList[i].duration * 1000 * speedup);
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

	// Retrieve upgrade cost, taking scaling into account
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	// return value: object with at least one of keys "wood", "food", "stone"
	getUpgradeCost(upgradeIdx) {
		const cost = { ...this.upgradeList[upgradeIdx].cost }; // We modify cost so need a copy
		const scaling = this.upgradeList[upgradeIdx].scaling ?? 1;
		const costFactor = scaling ** this.upgrades[upgradeIdx].completed;
		for (let i in cost) cost[i] = Math.ceil(cost[i] * costFactor);
		return cost;
	}

	// Determine if an upgrade is affordable
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	// return value: true if affordable, false otherwise
	canAffordUpgrade(upgradeIdx) {
		const cost = this.getUpgradeCost(upgradeIdx);
		if (
			(cost.wood ?? 0) <= this.wood &&
			(cost.food ?? 0) <= this.food &&
			(cost.stone ?? 0) <= this.stone
		)
			return true;
		return false;
	}

	// Determine if upgrade requirement has been met, and the upgrade should be shown
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	// return value: true if available, false otherwise
	upgradeRequirementMet(upgradeIdx) {
		if (!this.upgradeList[upgradeIdx].requirement) return true; // No requirement
		if (
			this.levels[this.upgradeList[upgradeIdx].requirement[0]] >=
			this.upgradeList[upgradeIdx].requirement[1]
		)
			return true;
		return false;
	}

	// Callback to run when an upgrade is clicked
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	upgradeClicked(upgradeIdx) {
		// Is it affordable?
		if (!this.upgrades[upgradeIdx].available) return;

		// Pay the cost and begin
		const cost = this.getUpgradeCost(upgradeIdx);
		this.wood -= cost.wood ?? 0;
		this.food -= cost.food ?? 0;
		this.stone -= cost.stone ?? 0;
		this.upgrades[upgradeIdx].started = true;
	}

	// Callback to run once an upgrade is completed
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	completeUpgrade(upgradeIdx) {
		// Perform upgrade effect and update upgrade state
		this.upgradeList[upgradeIdx].effect(this);
		this.upgrades[upgradeIdx].completed += 1;
		this.upgrades[upgradeIdx].started = false;
		this.upgrades[upgradeIdx].progress = 0;

		// Other upgrades might've been affected; refresh everything
		this.renderUpgrades();
	}

	// Run on every viewport draw to update the DOM for the user
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

		// Update building levels
		this.dom.tentLevel.textContent = this.levels.tent;
		this.dom.pierLevel.textContent = this.levels.pier;
		this.dom.quarryLevel.textContent = this.levels.quarry;
		this.dom.smithyLevel.textContent = this.levels.smithy;
		this.dom.academyLevel.textContent = this.levels.academy;

		// Update chaos indicators
		this.dom.pierChaos.textContent = Math.ceil(this.chaos.pier * 100);
		this.dom.quarryChaos.textContent = Math.ceil(this.chaos.quarry * 100);
		this.dom.smithyChaos.textContent = Math.ceil(this.chaos.smithy * 100);
		this.dom.academyChaos.textContent = Math.ceil(this.chaos.academy * 100);

		this.renderWorld();
	}

	// Refresh the upgrade tabs to show all available upgrades
	// Run only when required (an upgrade might've changed its availability)
	// Running every frame causes flicker
	renderUpgrades() {
		// Clean up the previous upgrade list
		this.dom.craft.replaceChildren();
		this.dom.research.replaceChildren();
		this.dom.upgrades.length = 0;

		// Update requirement state
		for (let i in this.upgradeList)
			this.upgrades[i].visible = this.upgradeRequirementMet(i);

		// Generate upgrade tabs' DOM
		for (let i in this.upgradeList) {
			const upgrade = this.upgrades[i];

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
				this.dom.craft.appendChild(el);
			else this.dom.research.appendChild(el);
		}
	}

	// Generate the upgrade element
	// upgradeIdx: index into the upgrade in upgrades/upgradeList
	// return value: a HTMLElement of the upgrade
	createUpgradeElement(upgradeIdx) {
		let el = document.createElement("div");
		el.classList.add("upgrade");

		let html = "";
		html += `<h3>${this.upgradeList[upgradeIdx].name}</h3>`;
		html += `<p class="description">${this.upgradeList[upgradeIdx].description}</p>`;
		html += `<p>Cost: `;
		const cost = this.getUpgradeCost(upgradeIdx);
		let atLeastOne = false;
		if (cost.wood) {
			html += `<span class="cost-wood"><span class="cost">${cost.wood}</span> wood</span>`;
			atLeastOne = true;
		}
		if (cost.food) {
			if (atLeastOne) html += `, `;
			html += `<span class="cost-food"><span class="cost">${cost.food}</span> food</span>`;
			atLeastOne = true;
		}
		if (cost.stone) {
			if (atLeastOne) html += `, `;
			html += `<span class="cost-stone"><span class="cost">${cost.stone}</span> stone</span>`;
		}
		html += `</p>`;
		el.innerHTML = html;
		return el;
	}

	// Update sizing and position of the village picture
	// Run every frame to handle window resize
	renderWorld() {
		// Calculate world image scale
		const smallerDim = Math.min(window.innerWidth, window.innerHeight);
		this.dom.world.style.setProperty("--scale", smallerDim / 640); // 640px is the native size

		// Center world display if area is not square
		const isLandscape =
			window.innerWidth > window.innerHeight ? true : false;
		if (isLandscape) {
			// Need to center horizontally
			const sideWidth = document.getElementById("side").offsetWidth;
			const worldWidth = window.innerWidth - sideWidth;

			this.dom.world.style.marginTop = 0;
			if (worldWidth < window.innerHeight)
				this.dom.world.style.marginLeft =
					-(window.innerHeight - worldWidth) / 2 + "px";
			else this.dom.world.style.marginLeft = 0;
		} else {
			// Need to center vertically
			const sideHeight = document.getElementById("side").offsetHeight;
			const worldHeight = window.innerHeight - sideHeight;

			this.dom.world.style.marginLeft = 0;
			if (worldHeight < window.innerWidth)
				this.dom.world.style.marginTop =
					-(window.innerWidth - worldHeight) / 2 + "px";
			else this.dom.world.style.marginTop = 0;
		}
	}

	// Returns wood gain per millisecond, taking into account all modifiers
	// return value: number
	getWoodProduction() {
		return this.production.lumberjack * this.lumberjack;
	}

	// Returns food gain per millisecond, taking into account all modifiers
	// return value: number
	getFoodProduction() {
		const contribution =
			this.fisherman.villager +
			this.fisherman.mentor * this.production.mentorBoost;
		return contribution * this.production.fisherman * (1 - this.chaos.pier);
	}

	// Returns stone gain per millisecond, taking into account all modifiers
	// return value: number
	getStoneProduction() {
		const contribution =
			this.miner.villager +
			this.miner.mentor * this.production.mentorBoost;
		return this.production.miner * contribution * (1 - this.chaos.quarry);
	}

	// Returns crafting speed multplier, taking into account all modifiers
	// return value: number
	getCraftSpeedup() {
		const contribution =
			this.blacksmith.villager +
			this.blacksmith.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.blacksmith ** contribution) *
				(1 - this.chaos.smithy)
		);
	}

	// Returns research speed multplier, taking into account all modifiers
	// return value: number
	getResearchSpeedup() {
		const contribution =
			this.professor.villager +
			this.professor.mentor * this.production.mentorBoost;
		return (
			1 -
			(1 - this.production.professor ** contribution) *
				(1 - this.chaos.academy)
		);
	}

	// Returns the chaos level for a given job, which is the fraction of
	// production that has been lost to mismanagement
	// job: a string that's a key into the "chaos" member
	// return value: number
	getChaosLevel(job) {
		const unpairedVillagers = Math.max(job.villager - job.mentor, 0);
		let penalty = job.mentor + unpairedVillagers - 1;
		penalty *= this.production.managerReduction ** job.manager;
		return Math.max(1 - 0.8 ** penalty, 0);
	}

	// Callback for manually collecting food
	gatherFood = () => {
		this.food += 1;
	};

	// Callback for manually collecting wood
	gatherWood = () => {
		this.wood += 1;
	};

	// Callback for assigning a villager to a position
	// Handles failure silently
	// job: string, a name of one of the assignable jobs
	// role: string, a name of the assignable roles (keys of the "[job]" member)
	assign(job, role) {
		if (this.lumberjack == 0) return;
		this.lumberjack -= 1;
		this[job][role] += 1;
		if (this[job][role] >= 2) game.unlock("chaos");
	}

	// Callback for unassigning a villager from a position
	// Handles failure silently
	// job: string, a name of one of the assignable jobs
	// role: string, a name of the assignable roles (keys of the "[job]" member)
	unassign(job, role) {
		if (this[job][role] == 0) return;
		this[job][role] -= 1;
		this.lumberjack += 1;
	}

	// Flip a DOM flag, showing a page element to the user
	// The list of flag names is available in the CSS on the "body" selector
	// name: string, name of the unlock CSS variable (without leading "--" or trailing "-display")
	unlock(name) {
		let display = "block";
		if (["fisherman", "miner", "blacksmith", "professor"].includes(name))
			display = "flex";
		if (["income", "chaos"].includes(name)) display = "inline";
		const nameDashed = Util.kebabCase(name);
		document.body.style.setProperty(`--${nameDashed}-display`, display);
		this.unlocks[name] = true;
	}

	// Set all unlock DOM flags to locked again
	lockEverything() {
		for (let name in this.unlocks) {
			const nameDashed = Util.kebabCase(name);
			document.body.style.setProperty(`--${nameDashed}-display`, "none");
		}
	}

	// Callback to run on tab change
	// tabName: string, one of the values from TABS constant below
	changeTab(tabName) {
		const TABS = ["assign", "craft", "research"];

		// Hide everything
		for (let tab of TABS) {
			this.dom[tab].style.display = "none";
			this.dom[tab + "Button"].classList.remove("active");
		}

		// Activate chosen tab
		this.dom[tabName].style.display = "block";
		this.dom[tabName + "Button"].classList.add("active");
	}

	// Append a message to the game's log window
	// type: string, a CSS class to set on the message paragraph
	// msg: string, the message to add
	logMessage(type, msg) {
		let el = document.createElement("p");
		el.textContent = msg;
		el.classList.add(type);
		this.dom.messageArea.prepend(el); // Prepend instead of append because of reverse flexbox direction
	}

	// Display a story message covering the whole screen
	// message: string, the paragraph of text to display
	// buttonText: string, text to show on the dismiss button
	// callback (optional): function to run once the dismiss button is pressed
	showStory(message, buttonText, callback) {
		this.dom.storyShroud.style.display = "flex";
		this.dom.storyText.textContent = message;
		this.dom.storyDismiss.textContent = buttonText;
		if (callback) this.dom.storyDismiss.addEventListener("click", callback);
	}

	// Save the game state to cookies
	save() {
		let state = {};
		for (let field of this.serializable) state[field] = this[field];
		localStorage.setItem("savegame", JSON.stringify(state));

		this.logMessage("info", "Game saved.");
	}

	// Load the game state from cookies
	load() {
		const state = JSON.parse(localStorage.getItem("savegame"));
		if (!state) return false; // Nothing to load
		for (let field of this.serializable) this[field] = state[field];
		this.renderUpgrades();

		// Refresh unlock state in DOM
		this.lockEverything();
		for (let unlock in this.unlocks)
			if (this.unlocks[unlock]) this.unlock(unlock);

		// Close pop-up if open
		this.dom.popupDismiss.click();

		this.dom.messageArea.replaceChildren(); // We don't restore log entries
		this.logMessage("info", "Game loaded.");
		return true;
	}

	// Delete cookies and start a new game
	reset() {
		localStorage.removeItem("savegame");
		window.location.reload();
	}

	// Apocalypse
	gameOver() {
		document.write("--");
	}

	// Instantly get enough resources to beat the game
	// Not called by anything; meant to be used from web console to speed up
	// testing. Try "game.cheat()"
	cheat() {
		this.wood = 100000;
		this.food = 100000;
		this.stone = 100000;
	}
}

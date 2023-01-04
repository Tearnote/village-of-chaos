// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	// Resources
	food = 0;
	wood = 0;
	stone = 0;

	// Buildings
	houses = 0;

	constructor(dom) {
		this.dom = dom;

		// Register button clicks
		this.dom.gatherFood.addEventListener(
			"click",
			this.gatherFood.bind(this)
		);
		this.dom.gatherWood.addEventListener(
			"click",
			this.gatherWood.bind(this)
		);

		// Add available upgrades
		for (let upgrade of UPGRADES) {
			let el = document.createElement("div");
			el.classList.add("upgrade");
			el.innerHTML = buildUpgradeEl(upgrade);
			el.addEventListener("click", clickHandler.bind(null, this, upgrade, el));
			this.dom.buildTab.appendChild(el);
		}
	}

	update(dt) {
		// Empty
	}

	render() {
		// Display resources
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	gatherFood() {
		this.food += 1;
	}

	gatherWood() {
		this.wood += 1;
	}
}

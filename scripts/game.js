// Game class
// Holds game state, is able to update it with a delta time and render state
// into the DOM

class Game {
	constructor(dom) {
		this.dom = dom;

		// Resources
		this.food = 0;
		this.wood = 0;
		this.stone = 0;

		// Buildings
		this.houses = 0;

		// Register button clicks
		this.dom.gatherFood.addEventListener("click", this.gatherFood);
		this.dom.gatherWood.addEventListener("click", this.gatherWood);

		// Add available upgrades
		for (let upgrade of UPGRADES) {
			let el = document.createElement("div");
			el.classList.add("upgrade");
			el.innerHTML = upgrade.buildHtml();
			el.addEventListener(
				"click",
				clickHandler.bind(null, this, upgrade, el)
			);
			this.dom.buildTab.appendChild(el);
		}
	}

	update(dt) {
		// Nothing yet
	}

	render() {
		// Display resources
		this.dom.food.textContent = Math.floor(this.food);
		this.dom.wood.textContent = Math.floor(this.wood);
		this.dom.stone.textContent = Math.floor(this.stone);
	}

	gatherFood = () => {
		this.food += 1;
	};

	gatherWood = () => {
		this.wood += 1;
	};
}

class Upgrade {
	constructor(params = {}) {
		this.active = true;
		this.name = params?.name;
		this.cost = params?.cost; // Array of 3 integers: [food, wood, stone]
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params?.scaling; // Only required if once is false
		this.effect = params?.effect; // Function to run on buying
	}

	buildHtml() {
		let html = "";
		html += `<p>${this.name}</p>`;
		html += `<p>Cost: `;
		let atLeastOne = false;
		if (this.cost[0] > 0) {
			html += `${this.cost[0]} food`;
			atLeastOne = true;
		}
		if (this.cost[1] > 0) {
			if (atLeastOne) html += `, `;
			html += `${this.cost[1]} wood`;
			atLeastOne = true;
		}
		if (this.cost[2] > 0) {
			if (atLeastOne) html += `, `;
			html += `${this.cost[2]} stone`;
			atLeastOne = true;
		}
		html += `</p>`;
		return html;
	}

	createElement(game) {
		this.el = document.createElement("div");
		this.el.classList.add("upgrade");
		this.el.innerHTML = this.buildHtml();
		this.el.addEventListener("click", this.clickHandler.bind(null, game));
		return this.el;
	}

	clickHandler = (game) => {
		// Pay the cost if possible
		if (
			game.food < this.cost[0] ||
			game.wood < this.cost[1] ||
			game.stone < this.cost[2] ||
			!this.active // Failsafe
		)
			return;
		game.food -= this.cost[0];
		game.wood -= this.cost[1];
		game.stone -= this.cost[2];

		// Perform upgrade effect and update upgrade state
		this.effect(game);
		if (this.once) {
			this.el.remove();
			this.el = null;
			this.active = false;
		} else {
			// Make element more expensive
			for (let i in this.cost) {
				this.cost[i] *= this.scaling;
				this.cost[i] = Math.ceil(this.cost[i]);
			}
			this.el.innerHTML = this.buildHtml();
		}
	};
}

const UPGRADES = [
	new Upgrade({
		name: "Build a house",
		cost: [20, 20, 0],
		once: false,
		scaling: 1.5,
		effect: function (game) {
			game.houses += 1;
		},
	}),
	new Upgrade({
		name: "Hunt down local wildlife",
		cost: [5, 5, 0],
		once: true,
		effect: function (game) {
			game.food += 30;
		},
	}),
];

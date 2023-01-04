class Upgrade {
	constructor(params = {}) {
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
}

function clickHandler(game, upgrade, el) {
	// Pay the cost if possible
	if (
		game.food < upgrade.cost[0] ||
		game.wood < upgrade.cost[1] ||
		game.stone < upgrade.cost[2]
	)
		return;
	game.food -= upgrade.cost[0];
	game.wood -= upgrade.cost[1];
	game.stone -= upgrade.cost[2];

	// Perform upgrade effect and update the upgrade
	upgrade.effect(game);
	if (upgrade.once) {
		el.remove();
	} else {
		for (let i in upgrade.cost) {
			upgrade.cost[i] *= upgrade.scaling;
			upgrade.cost[i] = Math.ceil(upgrade.cost[i]);
		}
		el.innerHTML = buildUpgradeEl(upgrade);
	}
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
	})
];

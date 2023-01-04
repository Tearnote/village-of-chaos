// An array of all available upgrades, stateless

function buildUpgradeEl(upgrade) {
	return `
		<p>${upgrade.name}</p>
		<p>Cost: ${upgrade.cost[0]} food, ${upgrade.cost[1]} wood, ${upgrade.cost[2]} stone</p>
	`;
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
	{
		name: "Build a house",
		cost: [20, 20, 0],
		once: false,
		scaling: 1.5,
		effect: function (game) {
			game.houses += 1;
		},
	},
];

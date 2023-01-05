// DOM class
// Holds DOM objects that are relevant to the game logic

class DOM {
	constructor() {
		// Resource indicators
		this.wood = document.getElementById("wood-amount");
		this.woodIncome = document.getElementById("wood-income");
		this.food = document.getElementById("food-amount");
		this.foodIncome = document.getElementById("food-income");
		this.stone = document.getElementById("stone-amount");
		this.stoneIncome = document.getElementById("stone-income");

		// Gathering buttons
		this.gatherWood = document.getElementById("gather-wood");
		this.gatherFood = document.getElementById("gather-food");

		// Interface tabs
		this.assignTab = document.getElementById("assign-tab");
		this.buildTab = document.getElementById("build-tab");
		this.researchTab = document.getElementById("research-tab");

		// Assignment counts
		this.lumberjacks = document.getElementById("lumberjacks");
		this.fishermen = document.getElementById("fishermen");
		this.miners = document.getElementById("miners");
		this.blacksmiths = document.getElementById("blacksmiths");

		// Chaos indicators
		this.pierChaos = document.getElementById("pier-chaos");
		this.quarryChaos = document.getElementById("quarry-chaos");
		this.smithyChaos = document.getElementById("smithy-chaos");

		// Assignment buttons
		this.fishermenUp = document.getElementById("fishermen-up");
		this.fishermenDown = document.getElementById("fishermen-down");
		this.minersUp = document.getElementById("miners-up");
		this.minersDown = document.getElementById("miners-down");
		this.blacksmithsUp = document.getElementById("blacksmiths-up");
		this.blacksmithsDown = document.getElementById("blacksmiths-down");

		this.log = document.getElementById("log");
	}
}

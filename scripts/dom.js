// DOM class
// Holds DOM objects that are relevant to the game logic

class DOM {
	constructor() {
		// Resource indicators
		this.wood = document.getElementById("wood-amount");
		this.food = document.getElementById("food-amount");
		this.stone = document.getElementById("stone-amount");

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

		this.log = document.getElementById("log");
	}
}

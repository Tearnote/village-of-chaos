// DOM class
// Holds DOM objects that are relevant to the game logic

class DOM {
	constructor() {
		// Resource indicators
		this.food = document.getElementById("food-amount");
		this.wood = document.getElementById("wood-amount");
		this.stone = document.getElementById("stone-amount");

		// Gathering buttons
		this.gatherFood = document.getElementById("gather-food");
		this.gatherWood = document.getElementById("gather-wood");

		// Interface tabs
		this.assignTab = document.getElementById("assign-tab");
		this.buildTab = document.getElementById("build-tab");
		this.researchTab = document.getElementById("research-tab");

		this.log = document.getElementById("log");
	}
}

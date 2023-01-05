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
		this.craftSpeed = document.getElementById("craft-speed");
		this.researchSpeed = document.getElementById("research-speed");

		// Gathering buttons
		this.gatherWood = document.getElementById("gather-wood");
		this.gatherFood = document.getElementById("gather-food");

		// Interface tabs
		this.assignTab = document.getElementById("assign-tab");
		this.buildTab = document.getElementById("build-tab");
		this.researchTab = document.getElementById("research-tab");

		// Assignment counts
		this.lumberjack = document.getElementById("lumberjack");
		this.fishermanVillager = document.getElementById("fisherman-villager");
		this.minerVillager = document.getElementById("miner-villager");
		this.blacksmithVillager = document.getElementById(
			"blacksmith-villager"
		);
		this.professorVillager = document.getElementById("professor-villager");
		this.fishermanMentor = document.getElementById("fisherman-mentor");
		this.minerMentor = document.getElementById("miner-mentor");
		this.blacksmithMentor = document.getElementById("blacksmith-mentor");
		this.professorMentor = document.getElementById("professor-mentor");

		// Chaos indicators
		this.pierChaos = document.getElementById("pier-chaos");
		this.quarryChaos = document.getElementById("quarry-chaos");
		this.smithyChaos = document.getElementById("smithy-chaos");
		this.academyChaos = document.getElementById("academy-chaos");

		// Assignment buttons
		this.fishermanVillagerUp = document.getElementById(
			"fisherman-villager-up"
		);
		this.fishermanVillagerDown = document.getElementById(
			"fisherman-villager-down"
		);
		this.minerVillagerUp = document.getElementById("miner-villager-up");
		this.minerVillagerDown = document.getElementById("miner-villager-down");
		this.blacksmithVillagerUp = document.getElementById(
			"blacksmith-villager-up"
		);
		this.blacksmithVillagerDown = document.getElementById(
			"blacksmith-villager-down"
		);
		this.professorVillagerUp = document.getElementById(
			"professor-villager-up"
		);
		this.professorVillagerDown = document.getElementById(
			"professor-villager-down"
		);
		this.fishermanMentorUp = document.getElementById(
			"fisherman-mentor-up"
		);
		this.fishermanMentorDown = document.getElementById(
			"fisherman-mentor-down"
		);
		this.minerMentorUp = document.getElementById("miner-mentor-up");
		this.minerMentorDown = document.getElementById("miner-mentor-down");
		this.blacksmithMentorUp = document.getElementById(
			"blacksmith-mentor-up"
		);
		this.blacksmithMentorDown = document.getElementById(
			"blacksmith-mentor-down"
		);
		this.professorMentorUp = document.getElementById(
			"professor-mentor-up"
		);
		this.professorMentorDown = document.getElementById(
			"professor-mentor-down"
		);

		this.log = document.getElementById("log");
	}
}

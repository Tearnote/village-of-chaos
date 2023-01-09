Game.prototype.displayPopups = function () {
	if (this.wood >= 4 && !this.resourcePopupShown) {
		this.showPopup(`Your current resource count is shown here.`, "header");
		this.resourcePopupShown = true;
	}
	if (this.wood >= 10 && this.food >= 10 && !this.tentPopupShown) {
		this.showPopup(
			`Not bad! You now have enough resources to build your first tent.
			This will invite two villagers to your village. They will be
			automatically employed as lumberjacks, producing wood for you over
			time. Click on "Build a tent" in the upgrade list to begin the
			craft.`,
			"#craft-tab"
		);
		this.tentPopupShown = true;
	}
	if (this.tentLvl >= 1 && !this.assignPopupShown) {
		document.getElementById("assign").click();
		this.showPopup(
			`Now that you have a tent, your village consists of two
			lumberjacks, which you can see in the newly unlocked "Assign" tab.
			Click on the "Craft" tab to get back to your list of available
			upgrades, and let's see if you can manage to build a fishing
			pier.`,
			"#interface"
		);
		this.assignPopupShown = true;
	}
	if (this.pierLvl >= 1 && !this.pierPopupShown) {
		document.getElementById("assign").click();
		this.showPopup(
			`With the fishing pier built, you can now assign some of your
			villagers to be fishermen, producing food over time. Use the "+"
			and "-" buttons to change your assignments. Any unassigned
			villagers will still gather wood for you.`,
			"#assign-tab"
		);
		this.pierPopupShown = true;
	}
	if (this.pierChaos > 0 && !this.chaosPopupShown) {
		this.showPopup(
			`Uh oh! With two villagers both taking care of the pier, it seems
			like they tend to step on each other's toes. The more villagers you
			assign to do the same job, the more chaotic their workplace
			becomes, and production slows down. You can see the slowdown factor
			in the "Chaos" column. Try to minimize this to make the most of
			your village.`,
			"#assign-tab"
		);
		this.chaosPopupShown = true;
	}
	if (this.quarryLvl >= 1 && !this.stonePopupShown) {
		this.showPopup(
			`With the construction of the quarry, you unlocked a new kind of
			resource! Assign miners to start gathering stone. You might also
			discover new crafts if you upgrade your existing buildings
			enough...`,
			"header"
		);
		this.stonePopupShown = true;
	}
	if (this.smithyLvl >= 1 && !this.smithyPopupShown) {
		this.showPopup(
			`Have you noticed that crafts are taking longer and longer to
			build? Assign blacksmiths to help you with your crafts, speeding up
			their creation significantly. The speed-up factor is shown next to
			your resource count.`,
			"header"
		);
		this.smithyPopupShown = true;
	}
	if (this.academyLvl >= 1 && !this.academyPopupShown) {
		document.getElementById("research").click();
		this.showPopup(
			`The academy is now standing! A brand new kind of upgrade has been
			unlocked - researches, which you can access via the new "Research"
			tab. You can now also assign professors who will speed up research
			progress, similarly to how blacksmiths speed up crafts.`,
			"#interface"
		);
		this.academyPopupShown = true;
	}
	if (this.mentorUnlocked && !this.mentorPopupShown) {
		document.getElementById("assign").click();
		this.showPopup(
			`Congratulations, you can now assign mentors to each job! Mentors
			are not only better at production than regular villagers, but they
			can also take on a villager as an apprentice. Each pair of mentor
			and villager will count as only one person for the purposes of
			Chaos, helping you to make your workplaces bigger without inviting
			mismanagement.`,
			"#assign-tab"
		);
		this.mentorPopupShown = true;
	}
	if (this.managerUnlocked && !this.managerPopupShown) {
		document.getElementById("assign").click();
		this.showPopup(
			`This is it - the cutting edge of team management. With managers on
			your teams, your production will be higher than ever before! Sure,
			managers don't actually produce anything, but the more of them you
			have, the lower your Chaos becomes. The sky's the limit! Soon,
			maybe you will be able to investigate that monolith on the
			horizon...`,
			"#assign-tab"
		);
		this.managerPopupShown = true;
	}
};

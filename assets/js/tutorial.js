// tutorial.js
// Extends the Game class with tutorial handling
// Keeps track of which pop-ups were already shown, their contents, and their
// requirements, as well as handling the actual display

// List of all possible pop-ups
// Value is true if shown
Game.prototype.tutorial = {
	resource: false,
	tent: false,
	assign: false,
	pier: false,
	chaos: false,
	stone: false,
	smithy: false,
	academy: false,
	mentor: false,
	manager: false,
};

// Show the relevant pop-up if a requirement has been meet
// Call this every update
Game.prototype.updatePopups = function () {
	if (this.wood >= 4 && !this.tutorial.resource) {
		this.showPopup(
			`Your current resource count is shown here.`,
			"#warehouse"
		);
		this.tutorial.resource = true;
	}
	if (this.wood >= 10 && this.food >= 10 && !this.tutorial.tent) {
		this.showPopup(
			`Not bad! You now have enough resources to build your first tent.
			This will invite two villagers to your village. They will be
			automatically employed as lumberjacks, producing wood for you over
			time. Click on "Build a tent" in the upgrade list to begin the
			craft.`,
			"#craft"
		);
		this.tutorial.tent = true;
	}
	if (this.levels.tent >= 1 && !this.tutorial.assign) {
		this.showPopup(
			`Now that you have a tent, your village consists of two
			lumberjacks, which you can see in the newly unlocked "Assign" tab.
			Click on the "Craft" tab to get back to your list of available
			upgrades, and let's see if you can manage to build a fishing
			pier. Feel free to make any other helpful crafts along the way!`,
			"#assign",
			"assign"
		);
		this.tutorial.assign = true;
	}
	if (this.levels.pier >= 1 && !this.tutorial.pier) {
		this.showPopup(
			`With the fishing pier built, you can now assign some of your
			villagers to be fishermen, producing food over time. Use the "+"
			and "-" buttons to change your assignments. Any unassigned
			villagers will still gather wood for you.`,
			"#assign",
			"assign"
		);
		this.tutorial.pier = true;
	}
	if (this.chaos.pier > 0 && !this.tutorial.chaos) {
		this.showPopup(
			`Uh oh! With two villagers both taking care of the pier, it seems
			like they tend to step on each other's toes. The more villagers you
			assign to do the same job, the more chaotic their workplace
			becomes, and production slows down. You can see the slowdown factor
			in the "Chaos" column. Try to minimize this to make the most of
			your village.`,
			"#assign"
		);
		this.tutorial.chaos = true;
	}
	if (this.levels.quarry >= 1 && !this.tutorial.stone) {
		this.showPopup(
			`With the construction of the quarry, you unlocked a new kind of
			resource! Assign miners to start gathering stone. You might also
			discover new crafts if you upgrade your existing buildings...`,
			"#warehouse"
		);
		this.tutorial.stone = true;
	}
	if (this.levels.smithy >= 1 && !this.tutorial.smithy) {
		this.showPopup(
			`Have you noticed that crafts are taking longer and longer to complete?
			Assign blacksmiths to help you with your crafts, speeding up
			their creation significantly. The speed-up factor is shown next to
			your resource count.`,
			"#warehouse"
		);
		this.tutorial.smithy = true;
	}
	if (this.levels.academy >= 1 && !this.tutorial.academy) {
		this.showPopup(
			`The village academy is now standing! A brand new kind of upgrade
			has been unlocked - researches, which you can access via the new
			"Research" tab. You can now also assign professors who will speed
			up research progress, similarly to how blacksmiths speed up crafts.`,
			"#research",
			"research"
		);
		this.tutorial.academy = true;
	}
	if (this.unlocks.mentor && !this.tutorial.mentor) {
		this.showPopup(
			`Congratulations, you can now assign mentors to each job! Mentors
			are not only better at production than regular villagers, but they
			can also take on a villager as an apprentice. Each pair of mentor
			and villager will count as only one person for the purposes of
			Chaos, helping you to make your workplaces bigger without inviting
			mismanagement.`,
			"#assign",
			"assign"
		);
		this.tutorial.mentor = true;
	}
	if (this.unlocks.manager && !this.tutorial.manager) {
		this.showPopup(
			`This is it - the cutting edge of team management. With managers on
			your teams, your production will be higher than ever before! Sure,
			managers don't actually produce anything, but the more of them you
			have, the lower your Chaos becomes. The sky's the limit! Soon,
			maybe you will be able to do something about that monolith on the
			horizon...`,
			"#assign",
			"assign"
		);
		this.tutorial.manager = true;
	}
};

// Show a pop-up to the player by modifying the DOM, with a small delay
// text: Main pop-up content plaintext
// atSelector (optional): CSS selector of a DOM element next to which the pop-up
//   will be placed. If undefined, pop-up will be centered
// switchTab (optional): name of an interface tab. If defined, the tab will be
//   activated when the pop-up appears
Game.prototype.showPopup = function (text, atSelector, switchTab) {
	setTimeout(() => {
		this.dom.popupShroud.style.display = "block";
		this.dom.popupText.textContent = text;

		// Switch the tab first in case it contains the atSelector element
		if (switchTab) this.dom[switchTab + "Button"].click();

		if (atSelector) {
			let target = document.querySelector(atSelector);
			const targetRect = target.getBoundingClientRect();
			const margin = parseInt(
				window.getComputedStyle(this.dom.popup).marginTop
			);

			// Determine if we're portrait or landscape
			const isPortrait = window.innerWidth >= window.innerHeight;

			// Start out overlapping the target
			let left = targetRect.left;
			let top = targetRect.top;

			if (isPortrait) {
				// Try positioning to the right of the target,
				// go to the left if that's off-screen
				left += target.offsetWidth;
				if (
					left + margin + this.dom.popup.offsetWidth >
					window.innerWidth
				)
					left =
						targetRect.left -
						margin * 2 -
						this.dom.popup.offsetWidth;
			} else {
				// Try positioning below the target,
				// go above if that's off-screen
				top += target.offsetHeight;
				if (
					top + margin + this.dom.popup.offsetHeight >
					window.innerHeight
				)
					top =
						targetRect.top -
						margin * 2 -
						this.dom.popup.offsetHeight;
			}

			// Clamp pop-up position to viewport, just in case
			left = Math.max(left, 0);
			left = Math.min(
				left,
				window.innerWidth - this.dom.popup.offsetWidth - margin * 2
			);
			top = Math.max(top, 0);
			top = Math.min(
				top,
				window.innerHeight - this.dom.popup.offsetHeight - margin * 2
			);

			this.dom.popup.style.left = left + "px";
			this.dom.popup.style.top = top + "px";

			target.style.zIndex = 1000; // Bring above the shroud (z 0) but below the pop-up (z 2000)
			target.style.pointerEvents = "none"; // Make sure target can't be interacted with while pop-up is visible
			this.dom.popupDismiss.addEventListener("click", () => {
				target.style.zIndex = "revert";
				target.style.pointerEvents = "revert";
			});
		} else {
			// Default - just center it
			this.dom.popup.style.left =
				window.innerWidth / 2 - this.dom.popup.offsetWidth / 2 + "px";
			this.dom.popup.style.top =
				window.innerHeight / 2 - this.dom.popup.offsetHeight / 2 + "px";
		}
	}, 800);
};

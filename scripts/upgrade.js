class Upgrade {
	constructor(params = {}) {
		this.active = true;
		this.name = params?.name;
		this.description = params?.description;
		this.type = params?.type; // "craft" or "research"
		this.cost = params?.cost; // Array of 3 integers: [food, wood, stone]
		this.duration = params?.duration; // Time it takes for the upgrade to complete (in seconds)
		this.once = params?.once; // True if upgrade should disappear once bought
		this.scaling = params.scaling; // Only required if once is false
		this.requirement = params?.requirement; // Optional, upgrade will only be available if this function returns true
		this.effect = params?.effect; // Function to run on buying

		this.started = false;
		this.progress = 0;
	}

	buildHtml() {
		let html = "";
		html += `<h2>${this.name}</h2>`;
		html += `<p>${this.description}</p>`;
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

	update(game, dt) {
		if (this.el) {
			// Progress the upgrade if started
			if (this.started) {
				let speedup = this.type == "craft"? game.getCraftSpeedup() : 1;
				console.log(speedup);
				this.progress += dt / (this.duration * 1000 * speedup);
				if (this.progress >= 1) {
					this.complete(game);
					if (this.once) return;
				}
			}

			// Update the DOM element
			if (this.requirement && !this.requirement(game))
				this.el.classList.add("unavailable");
			else this.el.classList.remove("unavailable");
			if (this.canAfford(game)) this.el.classList.remove("inactive");
			else this.el.classList.add("inactive");
			// Progress bar
			this.el.style.setProperty("--progress", this.progress * 100 + "%");
		}
	}

	canAfford(game) {
		if (
			game.food < this.cost[0] ||
			game.wood < this.cost[1] ||
			game.stone < this.cost[2]
		)
			return false;
		return true;
	}

	clickHandler = (game) => {
		// Pay the cost if possible and start the upgrade
		if (!this.canAfford(game) || !this.active) return;
		game.food -= this.cost[0];
		game.wood -= this.cost[1];
		game.stone -= this.cost[2];
		this.started = true;
	};

	complete(game) {
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

			// Clean up
			this.started = false;
			this.progress = 0;
		}
	}
}

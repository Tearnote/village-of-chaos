// GameLoop class by HipHopHuman
// https://gist.github.com/HipHopHuman/3e9b4a94b30ac9387d9a99ef2d29eb1a

const STOPPED = Symbol.for("@@gameloop/stopped");
const PAUSED = Symbol.for("@@gameloop/paused");
const RUNNING = Symbol.for("@@gameloop/running");

class GameLoop {
	constructor(options = {}) {
		this.state = STOPPED;
		this.options = {
			step: 1000 / 60,
			maxUpdates: 300,
			...options,
		};

		this.tick = this.tick.bind(this);
	}
	get isStopped() {
		return this.state === STOPPED;
	}
	get isPaused() {
		return this.state === PAUSED;
	}
	get isRunning() {
		return this.state === RUNNING;
	}
	start() {
		if (this.isStopped) {
			this.state = RUNNING;

			const lag = 0;
			const delta = 0;
			const total = 0;
			const last = null;

			this.timing = { last, total, delta, lag };
			this.frame = requestAnimationFrame(this.tick);
		}
	}
	stop() {
		if (this.isRunning || this.isPaused) {
			this.state = STOPPED;
			cancelAnimationFrame(this.frame);
		}
	}
	pause() {
		if (this.isRunning) {
			this.state = PAUSED;
			cancelAnimationFrame(this.frame);
		}
	}
	resume() {
		if (this.isPaused) {
			this.state = RUNNING;
			this.frame = requestAnimationFrame(this.tick);
		}
	}
	tick(time) {
		if (this.timing.last === null) this.timing.last = time;
		this.timing.delta = time - this.timing.last;
		this.timing.total += this.timing.delta;
		this.timing.lag += this.timing.delta;
		this.timing.last = time;

		let numberOfUpdates = 0;

		while (this.timing.lag >= this.options.step) {
			this.timing.lag -= this.options.step;
			this.onUpdate(this.options.step, this.timing.total);
			this.numberOfUpdates++;
			if (this.numberOfUpdates >= this.options.maxUpdates) {
				this.onPanic();
				break;
			}
		}

		this.onRender(this.timing.lag / this.options.step);

		this.frame = requestAnimationFrame(this.tick);
	}
}

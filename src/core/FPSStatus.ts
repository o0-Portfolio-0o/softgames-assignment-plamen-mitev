import { Application, Container, Text } from "pixi.js";

export class FPSStatus extends Container {
	private fpsText: Text;
	private app: Application;
	private frames: number = 0;
	private lastTime: number = 0;
	private fps: number = 0;

	constructor(app: Application, x: number, y: number, maxFPS: number) {
		super();

		this.app = app;
		this.x = x;
		this.y = y;

		this.fpsText = new Text({
			text: "FPS: 0",
			style: {
				fill: "#ffffff",
				fontSize: 24,
				fontFamily: 'monospace'
			}
		});

		this.addChild(this.fpsText);
		this.lastTime = performance.now();

		this.app.ticker.add(() =>{
			this._updateFPS();
		});
	}

	private _updateFPS() {
		const now = performance.now();
		const delta = now - this.lastTime;

		this.frames++;

		// Update every 500ms.
		if (delta > 500) {
			this.fps = Math.round((this.frames * 1000) / delta);
			this.fpsText.text = `FPS: ${this.fps}`;
			this.frames = 0;
			this.lastTime = now;
		}
	}
}
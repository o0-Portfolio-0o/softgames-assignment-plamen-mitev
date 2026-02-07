import { Application } from "pixi.js";

export class Responsive {
	static designWidth = 1280;
	static designHeight = 720;
	private static app: Application;

	static init(app: Application) {
		this.app = app;
		this.resize();
		window.addEventListener("resize", () => this.resize());
	}

	static resize() {
		if (!this.app) return;
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.app.renderer.resize(w, h);

		const scale = Math.min(w / this.designWidth, h / this.designHeight);
		this.app.stage.scale.set(scale, scale);

		const offsetX = Math.round((w - this.designWidth * scale) / 2);
		const offsetY = Math.round((h - this.designHeight * scale) / 2);
		this.app.stage.position.set(offsetX, offsetY);
	}

	static toDesignX(sceneX: number) {
		return (sceneX - this.app.stage.x) / this.app.stage.scale.x;
	}

	static toDesignY(sceneY: number) {
		return (sceneY - this.app.stage.y) / this.app.stage.scale.y;
	}
}
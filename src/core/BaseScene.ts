import { Application, Container } from "pixi.js";

export abstract class BaseScene {
	public container: Container = new Container();
	protected app!: Application;

	setApp(app: Application) {
		this.app = app;
	}

	abstract init(): void;
	abstract update(dt: number): void;
	abstract destroy(): void;
}
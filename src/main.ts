import { Application } from "pixi.js";
import { SceneManager } from "./core/SceneManager";
import { FPSStatus } from "./core/FPSStatus";
import { MainMenuScene } from "./scenes/MainMenu/MainMenuScene";

async function start() {
	const app = new Application();

	await app.init({
		background: '#333',
		resizeTo: window,
	});

	document.body.appendChild(app.canvas);

	SceneManager.init(app);

	const fpsStatus = new FPSStatus(app, 100, 100, 60);
	app.stage.addChild(fpsStatus);

	SceneManager.changeScene(new MainMenuScene());
}

start();
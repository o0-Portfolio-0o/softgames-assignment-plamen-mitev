import { Application, Assets } from "pixi.js";
import { SceneManager } from "./core/SceneManager";
import { FPSStatus } from "./core/FPSStatus";
import { MainMenuScene } from "./scenes/MainMenu/MainMenuScene";
import { Responsive } from "./core/Responsive";

async function start() {
	const app = new Application();

	await app.init({
		background: '#333',
		resizeTo: window,
	});

	Responsive.init(app);

	document.body.appendChild(app.canvas);

	await Assets.load("/assets/card.png");

	SceneManager.init(app);

	const fpsStatus = new FPSStatus(app, 100, 100, 60);

	app.stage.addChild(fpsStatus);

	app.ticker.add(() => {
		SceneManager.update(app.ticker.deltaMS);
	});

	SceneManager.changeScene(new MainMenuScene());
}

start();
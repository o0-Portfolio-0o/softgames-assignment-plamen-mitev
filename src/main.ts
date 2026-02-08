import { Application, Assets } from "pixi.js";
import { SceneManager } from "./core/SceneManager";
import { FPSStatus } from "./core/FPSStatus";
import { MainMenuScene } from "./scenes/MainMenu/MainMenuScene";
import { SoundManager } from "./core/SoundManager";

async function start() {
	const app = new Application();

	await app.init({
		background: '#333',
		resizeTo: window,
		autoDensity: true,
		resolution: window.devicePixelRatio,
	});

	document.body.appendChild(app.canvas);

	await Assets.load("/assets/card.png");
	await Assets.load("/assets/flame.png");

	await loadSounds();

	SceneManager.init(app);

	const fpsStatus = new FPSStatus(app, 10, 10, 60);

	app.stage.addChild(fpsStatus);

	app.ticker.add(() => {
		SceneManager.update(app.ticker.deltaMS);
	});

	SceneManager.changeScene(new MainMenuScene());

	//@ts-ignore
	globalThis.__PIXI_APP__ = app;
}

async function loadSounds() {
	return Promise.all([
		SoundManager.load("pop0", "/assets/sounds/pop0.wav", 0.5),
		SoundManager.load("pop1", "/assets/sounds/pop1.wav", 0.5),
		SoundManager.load("pop2", "/assets/sounds/pop2.wav", 0.5),
		SoundManager.load("pop3", "/assets/sounds/pop3.wav", 0.5),
		SoundManager.load("pop4", "/assets/sounds/pop4.wav", 0.5),
		SoundManager.load("pop5", "/assets/sounds/pop5.wav", 0.5),
		SoundManager.load("notification", "/assets/sounds/notification.wav", 0.5),
	]);
}

start();
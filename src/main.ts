import { Application } from "pixi.js";
import { SceneManager } from "./core/SceneManager";
import { FPSStatus } from "./core/FPSStatus";
import { MainMenuScene } from "./scenes/MainMenu/MainMenuScene";
import { SoundManager } from "./core/SoundManager";
import { ImageLoader } from "./core/ImageLoader";

async function start() {
	const app = new Application();

	await app.init({
		background: '#333',
		resizeTo: window,
		autoDensity: true,
		resolution: window.devicePixelRatio,
	});

	document.body.appendChild(app.canvas);

	await Promise.all([
		ImageLoader.preload(),
		SoundManager.preload(),
	]);

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

start();

window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    document.body.requestFullscreen();
  }
});
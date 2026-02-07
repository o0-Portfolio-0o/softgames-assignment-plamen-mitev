import { Application } from "pixi.js";

async function start() {
	const app = new Application();

	await app.init({
		background: '#333',
		resizeTo: window,
	});

	document.body.appendChild(app.canvas);
	console.log("hello, world!")
}

start();
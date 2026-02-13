import { Text, Container } from "pixi.js"
import gsap from "gsap";

export function createButton(label: string, x:number, y: number, container: Container, style: any, onClick: () => void) {
	const btn = new Text({ text: label, style });
	btn.interactive = true;
	btn.cursor = "pointer";
	btn.x = x;
	btn.y = y;

	btn.on("pointerdown", onClick);
	container.addChild(btn);
	return btn;
}

export function hitEffect(container: Container, {from, to}: {from: gsap.TweenVars; to: gsap.TweenVars;}) {
	return gsap.fromTo(container.scale, from, to)
}

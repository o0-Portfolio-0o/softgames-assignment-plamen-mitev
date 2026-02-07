import { Text, Container } from "pixi.js"
import { Responsive } from "../core/Responsive";

export function createButton(label: string, y: number, container: Container, style: any, onClick: () => void) {
	const btn = new Text({ text: label, style });
	btn.interactive = true;
	btn.cursor = "pointer";
	btn.x = Responsive.designWidth / 2 - 100;
	btn.y = y;

	btn.on("pointerdown", onClick);
	container.addChild(btn);
	return btn;
}
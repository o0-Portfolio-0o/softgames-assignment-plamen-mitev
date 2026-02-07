import { Text } from "pixi.js";
import { BaseScene } from "../../core/BaseScene";
import { SceneManager } from "../../core/SceneManager";
import { Responsive } from "../../core/Responsive";
import { AceOfShadowsScene } from "../AceOfShadows/AceOfShadowsScene";
import { MagicWordsScene } from "../MagicWords/MagicWordsScene";
import { PhoenixFlameScene } from "../PhoenixFlame/PhoenixFlameScene";

export const SCENES = {
	ACE_OF_SHADOWS: 'Ace of Shadows',
	MAGIC_WORDS: 'Magic Words',
	PHOENIX_FLAME: 'Phoenix Flame',
};

export class MainMenuScene extends BaseScene {
	init(): void {

		const title = new Text({
			text: 'Softgames Assignment Plamen Mitev',
			style: {
				fill: "#ffffff",
				fontSize: 32,
			}
		});

		title.anchor.set(0.5);
		title.x = Responsive.designWidth / 2;
		title.y = 100;
		this.container.addChild(title);

		this.createButton(SCENES.ACE_OF_SHADOWS, 200, () => {
			SceneManager.changeScene(new AceOfShadowsScene());
		});

		this.createButton(SCENES.MAGIC_WORDS, 300, () => {
			SceneManager.changeScene(new MagicWordsScene());
		});

		this.createButton(SCENES.PHOENIX_FLAME, 400, () => {
			SceneManager.changeScene(new PhoenixFlameScene());
		});
	}

	createButton(label: string, y: number, onClick: () => void) {
		const btn = new Text({
			text: label,
			style: {
				fill: "#00FFCC",
				fontSize: 24,
			}
		});
		btn.interactive = true;
		btn.cursor = "pointer";
		btn.x = window.innerWidth / 2 - 100;
		btn.y = y;

		btn.on("pointerdown", onClick);
		this.container.addChild(btn);
	}

	update(): void {}
	destroy(): void {}
}
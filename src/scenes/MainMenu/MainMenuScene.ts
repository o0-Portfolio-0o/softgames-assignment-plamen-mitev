import { Container, Text } from "pixi.js";
import { BaseScene } from "../../core/BaseScene";
import { SceneManager } from "../../core/SceneManager";
import { Responsive } from "../../core/Responsive";
import { AceOfShadowsScene } from "../AceOfShadows/AceOfShadowsScene";
import { MagicWordsScene } from "../MagicWords/MagicWordsScene";
import { PhoenixFlameScene } from "../PhoenixFlame/PhoenixFlameScene";
import { createButton } from "../../utils";
import baseConfig from "../../core/config";

export const SCENES = {
	ACE_OF_SHADOWS: 'Ace of Shadows',
	MAGIC_WORDS: 'Magic Words',
	PHOENIX_FLAME: 'Phoenix Flame',
};

export class MainMenuScene extends BaseScene {

	init(): void {
		const { ui } = baseConfig;

		const title = new Text({
			text: ui.title.label,
			style: ui.title.style
		});

		title.anchor.set(ui.title.anchor);
		title.x = Responsive.designWidth / 2;
		title.y = ui.title.position.y;
		this.container.addChild(title);

		createButton(
			SCENES.ACE_OF_SHADOWS,
			200,
			this.container,
			ui.backButton.style,
			() => SceneManager.changeScene(new AceOfShadowsScene())
		);

		createButton(
			SCENES.MAGIC_WORDS,
			300,
			this.container,
			ui.backButton.style,
			() => SceneManager.changeScene(new MagicWordsScene())
		);

		createButton(
			SCENES.PHOENIX_FLAME,
			400,
			this.container,
			ui.backButton.style,
			() => SceneManager.changeScene(new PhoenixFlameScene())
		);
	}

	update(): void {}
	destroy(): void {}
}
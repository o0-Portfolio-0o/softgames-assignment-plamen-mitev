import { Container, Text } from "pixi.js";
import { BaseScene } from "../../core/BaseScene";
import { SceneManager } from "../../core/SceneManager";
import { AceOfShadowsScene } from "../AceOfShadows/AceOfShadowsScene";
import { MagicWordsScene } from "../MagicWords/MagicWordsScene";
import { PhoenixFlameScene } from "../PhoenixFlame/PhoenixFlameScene";
import { createButton, hitEffect } from "../../utils";
import baseConfig from "../../core/config";

export const SCENES = {
	ACE_OF_SHADOWS: 'Ace of Shadows',
	MAGIC_WORDS: 'Magic Words',
	PHOENIX_FLAME: 'Phoenix Flame',
};

export class MainMenuScene extends BaseScene {
	private title!: Text;
	private btnAce!: Container;
	private btnWords!: Container;
	private btnPhoenix!: Container;
	private fullScreenText!: Text;
	init(): void {
		const { ui } = baseConfig;

		window.addEventListener("resize", this.onResize);

		this.title = new Text({
			text: ui.title.label,
			style: ui.title.style
		});

		this.title.x = window.innerWidth / 2 - this.title.width / 2;
		this.title.y = ui.title.position.y;
		this.container.addChild(this.title);
		const buttonXPos = window.innerWidth / 2 - 100;

		this.fullScreenText = new Text({text: 'Press F to enter fullscreen mode', style: {fill: 0xffffff, fontSize: 16 }});

		this.fullScreenText.y = window.innerHeight - 30;
		this.fullScreenText.x = 10;
		this.container.addChild(this.fullScreenText);

		this.btnAce = createButton(
			SCENES.ACE_OF_SHADOWS,
			buttonXPos,
			200,
			this.container,
			ui.backButton.style,
			async () => {
				hitEffect(this.btnAce, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new AceOfShadowsScene());
			}
		);

		this.btnWords = createButton(
			SCENES.MAGIC_WORDS,
			buttonXPos,
			300,
			this.container,
			ui.backButton.style,
			async () => {
				hitEffect(this.btnWords, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new MagicWordsScene())
			}
		);

		this.btnPhoenix = createButton(
			SCENES.PHOENIX_FLAME,
			buttonXPos,
			400,
			this.container,
			ui.backButton.style,
			async () => {
				hitEffect(this.btnPhoenix, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new PhoenixFlameScene())
			}
		);
	}

	onResize = () => {
			this.title.x = window.innerWidth / 2 - this.title.width / 2;
			this.btnAce.x = window.innerWidth / 2 - this.btnAce.width / 2;
			this.btnWords.x = window.innerWidth / 2 - this.btnWords.width / 2;
			this.btnPhoenix.x = window.innerWidth / 2 - this.btnPhoenix.width / 2;
			this.fullScreenText.y = window.innerHeight - 30;
		}

	update(): void {}

	destroy(): void {
		window.removeEventListener("resize", this.onResize);
	}
}
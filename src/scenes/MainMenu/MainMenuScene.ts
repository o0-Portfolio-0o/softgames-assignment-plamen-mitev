import { Container, Text, Texture } from "pixi.js";
import { BaseScene } from "../../core/BaseScene";
import { SceneManager } from "../../core/SceneManager";
import { AceOfShadowsScene } from "../AceOfShadows/AceOfShadowsScene";
import { MagicWordsScene } from "../MagicWords/MagicWordsScene";
import { PhoenixFlameScene } from "../PhoenixFlame/PhoenixFlameScene";
import { hitEffect } from "../../utils";
import baseConfig from "../../core/config";
import { Button } from "../../core/Button";
import { assetMap } from "../../core/assetsMap";

export const SCENES = {
	ACE_OF_SHADOWS: 'Ace of Shadows',
	MAGIC_WORDS: 'Magic Words',
	PHOENIX_FLAME: 'Phoenix Flame',
};

export class MainMenuScene extends BaseScene {
	private title!: Text;
	private btnAce!: Button;
	private btnWords!: Button;
	private btnPhoenix!: Button;
	private backButton!: Button;
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
		const buttonXPos = window.innerWidth / 2;

		this.fullScreenText = new Text({text: 'Press F to enter fullscreen mode', style: {fill: 0xffffff, fontSize: 16 }});

		this.fullScreenText.y = window.innerHeight - 30;
		this.fullScreenText.x = 10;
		this.container.addChild(this.fullScreenText);


		const buttonTexture = Texture.from(assetMap.images.button);

		this.btnAce = new Button({
			label: SCENES.ACE_OF_SHADOWS,
			texture: buttonTexture,
			textStyle: {fill: '#ffffff', fontFamily: 'monospace'},
			parentContainer: this.container,
			position: {
				x: buttonXPos,
				y: 300
			},
			onClick: async () => {
				hitEffect(this.btnAce, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new AceOfShadowsScene());
			}
		});


		this.btnWords = new Button({
			label: SCENES.MAGIC_WORDS,
			texture: buttonTexture,
			textStyle: {fill: '#ffffff', fontFamily: 'monospace'},
			parentContainer: this.container,
			position: {
				x: buttonXPos,
				y: 400
			},
			onClick: async () => {
				hitEffect(this.btnWords, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new MagicWordsScene());
			}
		});

		this.btnPhoenix = new Button({
			label: SCENES.PHOENIX_FLAME,
			texture: buttonTexture,
			textStyle: {fill: '#ffffff', fontFamily: 'monospace'},
			parentContainer: this.container,
			position: {
				x: buttonXPos,
				y: 500
			},
			onClick: async () => {
				hitEffect(this.btnPhoenix, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new PhoenixFlameScene());
			}
		});
	}


	onResize = () => {
			this.title.x = window.innerWidth / 2 - this.title.width / 2;
			this.btnAce.x = window.innerWidth / 2;
			this.btnWords.x = window.innerWidth / 2;
			this.btnPhoenix.x = window.innerWidth / 2 ;
			this.fullScreenText.y = window.innerHeight - 30;
	}

	update(): void {}

	destroy(): void {
		window.removeEventListener("resize", this.onResize);
	}
}
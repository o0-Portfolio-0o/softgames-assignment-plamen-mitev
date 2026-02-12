import { BaseScene } from "../../core/BaseScene";
import { Container, Texture } from "pixi.js";
import { SceneManager } from "../../core/SceneManager";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import { createButton } from "../../utils";
import baseConfig from "../../core/config";
import { PhoenixFlame } from "./PhoenixFlame";
import { hitEffect } from "../../utils";
import { assetMap } from "../../core/assetsMap";
export class PhoenixFlameScene extends BaseScene {
    private flame!: PhoenixFlame;
    private backBtn!: Container;

    init(): void {
        const flameTexture = Texture.from(assetMap.images.flame);
        window.addEventListener('resize', this.onResize);
        const { label, position: { y }, style } = baseConfig.ui.backButton;

        this.flame = new PhoenixFlame(flameTexture, window.innerWidth / 2, window.innerHeight - 100);
        this.container.addChild(this.flame);

        this.backBtn = createButton(
            label,
			window.innerWidth - 100,
            y,
            this.container,
            style,
			async () => {
				hitEffect(this.backBtn, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
				await new Promise(r => setTimeout(r, 200));
				SceneManager.changeScene(new MainMenuScene());
			}
        );
    }

    update(deltaMS: number): void {
        this.flame.update(deltaMS);
    }

    destroy(): void {
        if (this.flame) {
            this.flame.destroyFlame();
            this.flame.destroy({ children: true });
        }
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        this.backBtn.x = window.innerWidth - 100;
        this.flame.x = 0;
        this.flame.y = 0;
    }
}
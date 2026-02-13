import { BaseScene } from "../../core/BaseScene";
import { Texture } from "pixi.js";
import { SceneManager } from "../../core/SceneManager";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import baseConfig from "../../core/config";
import { PhoenixFlame } from "./PhoenixFlame";
import { hitEffect } from "../../utils";
import { assetMap } from "../../core/assetsMap";
import { Button } from "../../core/Button";
export class PhoenixFlameScene extends BaseScene {
    private flame!: PhoenixFlame;
    private backButton!: Button;

    init(): void {
        const flameTexture = Texture.from(assetMap.images.flame);
        window.addEventListener('resize', this.onResize);
        const { label, position: { y }, style } = baseConfig.ui.backButton;

        this.flame = new PhoenixFlame(flameTexture, window.innerWidth / 2, window.innerHeight - 100);
        this.container.addChild(this.flame);


        const buttonTexture = Texture.from(assetMap.images.backButton);

        this.backButton = new Button({
            label: "👈 BACK",
            texture: buttonTexture,
            textStyle: { fill: '#ffffff', fontFamily: 'monospace', fontSize: 16 },
            parentContainer: this.container,
            position: {
                x: window.innerWidth - 90,
                y: 40
            },
            onClick: async () => {
                hitEffect(this.backButton, baseConfig.games.aceOfShadows.targetStack.animations.deck.hit);
                await new Promise(r => setTimeout(r, 200));
                SceneManager.changeScene(new MainMenuScene());
            }
        });

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
        this.backButton.x = window.innerWidth - 100;
        this.flame.x = 0;
        this.flame.y = 0;
    }
}
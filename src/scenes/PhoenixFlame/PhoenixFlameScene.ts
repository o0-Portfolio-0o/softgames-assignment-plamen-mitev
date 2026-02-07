import { BaseScene } from "../../core/BaseScene";
import { Texture } from "pixi.js";
import { SceneManager } from "../../core/SceneManager";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import { createButton } from "../../utils";
import baseConfig from "../../core/config";
import { PhoenixFlame } from "./PhoenixFlame";

export class PhoenixFlameScene extends BaseScene {
    private flame!: PhoenixFlame;

    init(): void {
        const flameTexture = Texture.from("/assets/flame.png");
        const { label, position: { y }, style } = baseConfig.ui.backButton;

        this.flame = new PhoenixFlame(flameTexture, 400, 500);
        this.container.addChild(this.flame);

        createButton(
            label,
            y,
            this.container,
            style,
            () => SceneManager.changeScene(new MainMenuScene())
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
    }
}
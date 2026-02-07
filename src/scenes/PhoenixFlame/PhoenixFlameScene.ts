import { BaseScene } from "../../core/BaseScene";
import { createButton } from "../../utils";
import { SceneManager } from "../../core/SceneManager";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import baseConfig from "../../core/config";
export class PhoenixFlameScene extends BaseScene {
	init(): void {
		const { style, label, position: { y } } = baseConfig.ui.backButton;
		createButton(
			label,
			y,
			this.container,
			style,
			() => SceneManager.changeScene(new MainMenuScene())
		);
	}

	update(): void {}
	destroy(): void {}
}
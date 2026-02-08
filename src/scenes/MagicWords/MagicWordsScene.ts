import { BaseScene } from "../../core/BaseScene";
import { createButton } from "../../utils";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import { SceneManager } from "../../core/SceneManager";
import { loadDialogueData } from "./DialogueLoader";

import baseConfig from "../../core/config";
import { playDialogue } from "./DialogManager";
import { Responsive } from "../../core/Responsive";
export class MagicWordsScene extends BaseScene {
	async init() {
		const { style, label, position: { y } } = baseConfig.ui.backButton;

		const {data, emojiTextures, avatarTextures } = await loadDialogueData("https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords");
		await playDialogue(
			this.app,
			data.dialogue,
			data.avatars,
			avatarTextures,
			emojiTextures,
			Responsive.designWidth
		);

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
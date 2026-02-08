import { Container, Sprite, Text, Texture } from "pixi.js";
import baseConfig from "../../core/config";

export function emojiParser(
	raw: string,
	emojiTextures: Map<string, Texture>,
	fontSize = 22
): Container {
	const container =  new Container();
	const parts = raw.split(/(\{.*?\})/g);

	let x = 0;
	const { baseLineOffset, fontSizeMultiplier, widthOffset, style } = baseConfig.games.magicWords.emojiParser;
	for (const part of parts) {
		const match = part.match(/^\{(.*)\}$/);

		if (match) {
			const emojiName = match[1];
			const texture = emojiTextures.get(emojiName);
			if (!texture) continue;

			const emoji = new Sprite(texture);
			const targetHeight = fontSize * fontSizeMultiplier;
			const scale = targetHeight / texture.height;
			emoji.scale.set(scale);

			emoji.x = x;
			emoji.y = -baseLineOffset;
			container.addChild(emoji);

			x += emoji.width + widthOffset;
			continue;
		}

		if (part.trim().length > 0) {
			const text = new Text({text: part, style});
			text.x = x;
			text.y = 0;
			container.addChild(text);

			x += text.width;
		}
	}
	return container;
}
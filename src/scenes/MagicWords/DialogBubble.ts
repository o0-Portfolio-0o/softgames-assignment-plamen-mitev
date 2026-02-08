import { Container, Sprite, Text, Texture, Graphics } from "pixi.js";
import { emojiParser } from "./EmojiParser";
import { AvatarDef, DialogEntry } from "./DialogueLoader";
import { gsapTypewriter } from "./Typewriter";
import baseConfig from "../../core/config";

export function createDialogBubble(
	entry: DialogEntry,
	avatars: AvatarDef[],
	avatarTextures: Map<string, Texture>,
	emojiTextures: Map<string, Texture>,
	designWidth: number
) {
	const bubble = new Container();
	bubble.sortableChildren = true;

	const { padding, startOffset, avatarHeight, zIndex, styles } = baseConfig.games.magicWords.dialogBubble;

	const avatarDef = avatars.find( a => a.name === entry.name);
	const avatarTexture = avatarDef ? avatarTextures.get(avatarDef.name) : undefined;

	let avatarSprite: Sprite | null = null;

	if (avatarTexture) {
		avatarSprite = new Sprite(avatarTexture);
		avatarSprite.width = avatarSprite.height = avatarHeight;
		avatarSprite.y = padding;
		avatarSprite.zIndex = zIndex.avatar;
		bubble.addChild(avatarSprite);
	}

	const nameText = new Text({ text: entry.name, style: styles.name });
	nameText.zIndex = zIndex.name;

	const richText = emojiParser(entry.text, emojiTextures, styles.emojiText.fontSize);
	richText.zIndex = zIndex.emoji;

	const startX = avatarSprite ? avatarSprite.width + padding * startOffset : padding;

	nameText.x = startX;
	nameText.y = padding;

	richText.x = startX;
	richText.y = nameText.y + nameText.height + styles.emojiText.offsetY;

	bubble.addChild(nameText);
	bubble.addChild(richText);

	const totalWidth = Math.max(
		nameText.x + nameText.width,
		richText.x + richText.width
	) + padding;

	const totalHeight = richText.y + richText.height + padding;

	const bg = new Graphics()
		.roundRect(
			padding / 2,
			padding/ 2,
			totalWidth,
			totalHeight,
			14
		).fill({color: 0x00bbee});

		bg.zIndex = zIndex.bg;
		bubble.addChild(bg);
		bubble.alpha = 0;

		const timeline = gsapTypewriter(richText, 0.04);
		return { bubble, timeline };
}
import { BaseScene } from "../../core/BaseScene";
import { createButton } from "../../utils";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import { SceneManager } from "../../core/SceneManager";
import { Graphics, Container, Texture, Sprite, Text, Application, wordWrap } from "pixi.js";
import { SoundManager } from "../../core/SoundManager";
import baseConfig from "../../core/config";
import { gsapTypewriter } from "./Typewriter";
import gsap from "gsap";
export interface DialogEntry {
	name: string;
	text: string;
}

export interface EmojiDef {
	name: string;
	url: string;
}

export interface AvatarDef {
	name: string;
	url: string;
	position: "left" | "right" | string;
}

export interface ApiData {
	dialogue: DialogEntry[];
	emojies: EmojiDef[];
	avatars: AvatarDef[];
}
export class MagicWordsScene extends BaseScene {
	private currentBubble!: Container;
	private isMobile = window.innerWidth <= 600;

	async init() {
		const { style, label, position: { y } } = baseConfig.ui.backButton;

		window.addEventListener("resize", this.onResize);

		const { data, emojiTextures, avatarTextures } = await this.loadDialogueData("https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords");
		await this.playDialogue(
			this.app,
			data.dialogue,
			data.avatars,
			avatarTextures,
			emojiTextures,
			window.innerWidth,
			window.innerHeight
		);

		createButton(
			label,
			window.innerWidth - 100,
			y,
			this.container,
			style,
			() => SceneManager.changeScene(new MainMenuScene())
		);
	}

	private emojiParser(
		raw: string,
		emojiTextures: Map<string, Texture>,
		fontSize = 22
	): Container {
		const container = new Container();
		const parts = raw.split(/(\{.*?\})/g);

		let y = 0;
		const { baseLineOffset, fontSizeMultiplier, widthOffset, style } =
			baseConfig.games.magicWords.emojiParser;

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

				emoji.x = 0;
				emoji.y = y - baseLineOffset;

				container.addChild(emoji);
				y += emoji.height + widthOffset;
				continue;
			}

			if (part.trim().length > 0) {
				const currentStyles = this.isMobile
					? { ...style, wordWrap: true, wordWrapWidth: window.innerWidth - 20 }
					: style;

				const text = new Text({ text: part, style: currentStyles });
				text.x = 0;
				text.y = y;

				container.addChild(text);
				y += text.height + 4; // spacing
			}
		}

		return container;
	}

	private loadRemoteTexture(url: string): Promise<Texture> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => resolve(Texture.from(img));
			img.onerror = () => reject(new Error("Failed to load " + url));
			img.src = url;
		});
	}

	private async loadDialogueData(url: string) {
		const res = await fetch(url);
		const data: ApiData = await res.json();
		const emojiTextures = new Map<string, Texture>
		const avatarTextures = new Map<string, Texture>

		for (const emoji of data.emojies) {
			const texture = await this.loadRemoteTexture(emoji.url);
			emojiTextures.set(emoji.name, texture);
		}

		for (const avatar of data.avatars) {
			const texture = await this.loadRemoteTexture(avatar.url);
			avatarTextures.set(avatar.name, texture);
		}

		return { data, emojiTextures, avatarTextures };
	}

	private async playDialogue(
		app: Application,
		entries: DialogEntry[],
		avatars: AvatarDef[],
		avatarTextures: Map<string, Texture>,
		emojiTextures: Map<string, Texture>,
		windowInnerWidth: number,
		windowInnerHeight: number
	) {

		const container = new Container();
		app.stage.addChild(container);

		let side: "left" | "right" = "left";
		let isTyping = false;
		let skipRequest = false;

		const onClick = () => {
			skipRequest = true;
		};

		window.addEventListener("pointerdown", onClick);
		const { offset } = baseConfig.games.magicWords.dialogManager;
		const { displayTime } = baseConfig.games.magicWords.dialogManager;

		try {
			for (const entry of entries) {
				skipRequest = false;

				const { bubble, timeline, richText } = this.createDialogBubble(
					entry,
					avatars,
					avatarTextures,
					emojiTextures,
					windowInnerWidth,
				);
				this.currentBubble = bubble;
				const bubblePosXBasedOnSide = side === "left" ? offset : window.innerWidth - bubble.width - offset;
				const bubblePosYBasedOnSide = side === "left" ? 100 : window.innerHeight - 200;
				const bubblePosX = this.isMobile ? window.innerWidth / 2 - bubble.width / 2 : bubblePosXBasedOnSide;
				const bubblePosY = this.isMobile ? bubblePosYBasedOnSide : window.innerHeight - bubble.height - offset;
				bubble.x = bubblePosX;
				bubble.y = bubblePosY;
				bubble.alpha = 0;
				container.addChild(bubble);

				await gsap.to(bubble, {
					alpha: 1, duration: 0.3,
					onStart: () => {
						if ("scale" in bubble) {
							const baseX = bubble.scale.x;
							const baseY = bubble.scale.y;
							gsap.fromTo(
								bubble.scale,
								{ x: baseX * 0.5, y: baseY * 0.5 },
								{
									x: baseX,
									y: baseY,
									duration: 0.2,
									ease: "back.out(2)",
									overwrite: true,
									onComplete: () => {
										SoundManager.play("notification", 0.1)
									}
								}
							);
						}
					}
				});
				isTyping = true;

				let resolveTypewriter!: () => void;
				const typewriterPromise = new Promise<void>(resolve => {
					resolveTypewriter = resolve;
					timeline.eventCallback("onComplete", () => {
						isTyping = false;
						resolve();
					});

					timeline.play();
				});

				while (isTyping) {
					if (skipRequest) {
						(timeline as any).revealAll();
						if ("scale" in bubble) {
							bubble.scale.set(1);
						}
						isTyping = false;
						resolveTypewriter();
						break;
					}

					await new Promise(r => setTimeout(r, 16));
				}

				await typewriterPromise;

				if (!skipRequest) {
					let elapsed = 0;
					const step = 16;
					while (elapsed < displayTime && !skipRequest) {
						await new Promise(r => setTimeout(r, step));
						elapsed += step;
					}
				} else {
					await new Promise(r => setTimeout(r, 800));
				}

				await gsap.to(bubble, { alpha: 0, duration: 0.3 });

				timeline.kill();
				gsap.killTweensOf(bubble);
				container.removeChild(bubble);
				bubble.destroy({ children: true });

				side = side === "left" ? "right" : "left";
			}
		} finally {
			window.removeEventListener("pointerdown", onClick);
			gsap.killTweensOf(container);
			gsap.globalTimeline.clear();
			container.destroy({ children: true })
		}
	}

	private createDialogBubble(
		entry: DialogEntry,
		avatars: AvatarDef[],
		avatarTextures: Map<string, Texture>,
		emojiTextures: Map<string, Texture>,
		designWidth: number
	) {
		const bubble = new Container();
		bubble.sortableChildren = true;

		const { padding, startOffset, avatarHeight, zIndex, styles } = baseConfig.games.magicWords.dialogBubble;

		const avatarDef = avatars.find(a => a.name === entry.name);
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

		const richText = this.emojiParser(entry.text, emojiTextures, styles.emojiText.fontSize);
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
				padding / 2,
				totalWidth,
				totalHeight,
				14
			).fill({ color: 0x00bbee });

		bg.zIndex = zIndex.bg;
		bubble.addChild(bg);
		bubble.alpha = 0;

		const timeline = gsapTypewriter(richText, 0.3);
		if (this.isMobile) {
			bubble.scale.set(0.8)
		}
		return { bubble, timeline, richText };
	}

	onResize = () => {
		this.isMobile = window.innerWidth <= 600;
	}

	update(): void { }

	destroy(): void {
		window.removeEventListener("resize", this.onResize);
	}
}
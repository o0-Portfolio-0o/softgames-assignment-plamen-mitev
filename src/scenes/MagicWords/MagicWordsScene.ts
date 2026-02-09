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
	private isMobile = window.innerWidth <= baseConfig.games.magicWords.config.mobileWidthThreshold;

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
			window.innerWidth - baseConfig.games.magicWords.config.backButtonOffsetX,
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
		const config = baseConfig.games.magicWords.config;
		const maxWidth = this.isMobile ? window.innerWidth - config.mobileInnerPadding : config.maxWidthDesktop;

		const parts = raw.split(/(\{.*?\})/g);

		let x = 0;
		let y = 0;
		const lineHeight = fontSize * config.emojiLineHeightMultiplier;

		for (const part of parts) {
			if (!part.trim()) continue;

			const match = part.match(/^\{(.*)\}$/);

			if (match) {
				const emojiName = match[1];
				const texture = emojiTextures.get(emojiName);
				if (!texture) continue;

				const emoji = new Sprite(texture);
				const scale = fontSize / texture.height;
				emoji.scale.set(scale);

				if (x + emoji.width > maxWidth) {
					x = 0;
					y += lineHeight;
				}

				emoji.x = x;
				emoji.y = y;
					container.addChild(emoji);

					x += emoji.width + config.emojiGap;
			} else {
				const words = part.split(/(\s+)/);

				for (const word of words) {
					const text = new Text({
						text: word,
						style: {
							fontSize,
							fill: baseConfig.games.magicWords.emojiParser.style.fill
						}
					});

					if (x + text.width > maxWidth) {
						x = 0;
						y += lineHeight;
					}

					text.x = x;
					text.y = y;
					container.addChild(text);

					x += text.width;
				}
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
		const { offset, displayTime } = baseConfig.games.magicWords.dialogManager;
		const config = baseConfig.games.magicWords.config;

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
				const bubblePosYBasedOnSide = side === "left" ? config.bubbleTopY || 100 : window.innerHeight - (config.bubbleBottomYOffset || 200);
				const bubblePosX = this.isMobile ? window.innerWidth / 2 - bubble.width / 2 : bubblePosXBasedOnSide;
				const bubblePosY = this.isMobile ? bubblePosYBasedOnSide : window.innerHeight - bubble.height - offset;
				bubble.x = bubblePosX;
				bubble.y = bubblePosY;
				bubble.alpha = 0;
				container.addChild(bubble);

				await gsap.to(bubble, {
					alpha: 1, duration: config.bubble.fadeDuration,
					onStart: () => {
						if ("scale" in bubble) {
							const baseX = bubble.scale.x;
							const baseY = bubble.scale.y;
							gsap.fromTo(
								bubble.scale,
								{ x: baseX * config.bubble.pop.scaleFactor, y: baseY * config.bubble.pop.scaleFactor },
								{
									x: baseX,
									y: baseY,
									duration: config.bubble.pop.duration,
									ease: config.bubble.pop.ease,
									overwrite: true,
									onComplete: () => {
										SoundManager.play("notification", config.sound.notificationVolume)
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
							bubble.scale.set(
								(bubble as any)._baseScaleX,
								(bubble as any)._baseScaleY,
							);
						}
						isTyping = false;
						resolveTypewriter();
						break;
					}

						await new Promise(r => setTimeout(r, config.timing.frameStepMs));
				}

				await typewriterPromise;

				if (!skipRequest) {
					let elapsed = 0;
					const step = config.timing.frameStepMs;
					while (elapsed < displayTime && !skipRequest) {
						await new Promise(r => setTimeout(r, step));
						elapsed += step;
					}
				} else {
						await new Promise(r => setTimeout(r, config.timing.skipWaitMs));
				}

				await gsap.to(bubble, { alpha: 0, duration: config.bubble.fadeDuration });

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
		const config = baseConfig.games.magicWords.config;

		if (this.isMobile) {
			bubble.scale.set(config.bubble.mobileScale || 0.8);
		}

		(bubble as any)._baseScaleX = bubble.scale.x;
		(bubble as any)._baseScaleY = bubble.scale.y;

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
				config.bubble.cornerRadius
			).fill({ color: config.bubble.color });

		bg.zIndex = zIndex.bg;
		bubble.addChild(bg);
		bubble.alpha = 0;

		const timeline = gsapTypewriter(richText, config.timing.typewriterSpeed);
		if (this.isMobile) {
			bubble.scale.set(config.bubble.mobileScale || 0.8)
		}
		return { bubble, timeline, richText };
	}

	onResize = () => {
		this.isMobile = window.innerWidth <= baseConfig.games.magicWords.config.mobileWidthThreshold;
	}

	update(): void { }

	destroy(): void {
		window.removeEventListener("resize", this.onResize);
	}
}
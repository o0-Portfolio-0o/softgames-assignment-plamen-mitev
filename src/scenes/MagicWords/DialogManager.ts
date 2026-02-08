import { Application, Container, Texture } from "pixi.js";
import { AvatarDef, DialogEntry } from "./DialogueLoader";
import { createDialogBubble } from "./DialogBubble";
import gsap from "gsap";
import { Responsive } from "../../core/Responsive";
import baseConfig from "../../core/config";
import { SoundManager } from "../../core/SoundManager";

export async function playDialogue(
	app: Application,
	entries: DialogEntry[],
	avatars: AvatarDef[],
	avatarTextures: Map<string, Texture>,
	emojiTextures: Map<string, Texture>,
	designWidth: number,
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
	const { leftX, offset } = baseConfig.games.magicWords.dialogManager.positions;
	const { displayTime } = baseConfig.games.magicWords.dialogManager;

	try {
		for (const entry of entries) {
			skipRequest = false;

			const { bubble, timeline } = createDialogBubble(
				entry,
				avatars,
				avatarTextures,
				emojiTextures,
				designWidth,
			);

			bubble.x = side === "left" ? leftX : designWidth - bubble.width - leftX;
			bubble.y = Responsive.designHeight - bubble.height - offset.y;
			bubble.alpha = 0;
			container.addChild(bubble);

			await gsap.to(bubble, {alpha: 1, duration: 0.3,
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
				while (elapsed < displayTime && !skipRequest ) {
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
			bubble.destroy({ children: true});

			side = side === "left" ? "right" : "left";
		}
	} finally {
		window.removeEventListener("pointerdown", onClick);
		gsap.killTweensOf(container);
		gsap.globalTimeline.clear();
		container.destroy({ children: true })
	}
}
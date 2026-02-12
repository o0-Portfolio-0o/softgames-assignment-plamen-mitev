import { Container, Texture, Sprite } from "pixi.js";
import { BaseScene } from "../../core/BaseScene";
import { createButton } from "../../utils";
import { SceneManager } from "../../core/SceneManager";
import { MainMenuScene } from "../MainMenu/MainMenuScene";
import baseConfig from "../../core/config";
import gsap from "gsap";
import { hitEffect } from "../../utils";
import { SoundManager } from "../../core/SoundManager";
import { assetMap, SoundKeys } from "../../core/assetsMap";
export class AceOfShadowsScene extends BaseScene {
	private sourceStack!: Container;
	private targetStack!: Container;
	private spawnAccumulatorMs = 0;
	private backBtn!: Container;

	init(): void {
		const { style, label, position: { y } } = baseConfig.ui.backButton;
		window.addEventListener('resize', this.onResize);
		this.createStack();
		this.createCards();
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

	update(deltaMs: number): void {
		if (this.sourceStack.children.length > 0) {
			this.spawnAccumulatorMs += deltaMs;

			if (this.spawnAccumulatorMs >= baseConfig.games.aceOfShadows.flyDelayMs) {
				this.spawnAccumulatorMs -= baseConfig.games.aceOfShadows.flyDelayMs;
				this.moveTopCard();
			}
		}
	}

	destroy(): void {
		this.container.removeChildren();
		gsap.globalTimeline.clear();
		window.removeEventListener('resize', this.onResize);
	}

	private createStack() {
		const { sourceStack, targetStack } = baseConfig.games.aceOfShadows;

		this.sourceStack = new Container();
		this.targetStack = new Container();

		this.sourceStack.x = window.innerWidth * sourceStack.position.xOffset;
		this.sourceStack.y = window.innerHeight - 100;

		this.targetStack.x = window.innerWidth * targetStack.position.xOffset;
		this.targetStack.y = window.innerHeight - 100;
		this.container.addChild(this.sourceStack, this.targetStack);
	}

	private createCards() {
		const { totalCards, anchor, yOffset } = baseConfig.games.aceOfShadows;

		const cardTexture = Texture.from(assetMap.images.card);
		for (let i = 0; i < totalCards; i++) {
			const card = new Sprite(cardTexture);
			card.anchor.set(anchor);
			card.rotation = (Math.random() * 0.1) - 0.05;
			card.y = -i * yOffset;
			this.sourceStack.addChild(card);
		}
	}

	private moveTopCard() {
		if (this.sourceStack.children.length === 0) return;

		const { yOffset } = baseConfig.games.aceOfShadows.targetStack.position;

		const card = this.sourceStack.children[this.sourceStack.children.length - 1] as Sprite;

		const globalStart = card.getGlobalPosition();
		this.sourceStack.removeChild(card);

		this.deckLaunchEffect();

		const localStart = this.container.toLocal(globalStart);
		this.container.addChild(card);
		card.x = localStart.x;
		card.y = localStart.y;

		const endRot = (Math.random() * 0.1) - 0.05;
		const endX = this.targetStack.x;
		const endY = this.targetStack.y - this.targetStack.children.length * yOffset;

		this.animateCardFlight(card, localStart, { endX, endY, endRot });
	}

	private animateCardFlight(
		card: Sprite,
		localStart: { x: number; y: number },
		{ endX, endY, endRot }: { endX: number; endY: number; endRot: number }
	) {
		const { flying, scaling } = baseConfig.games.aceOfShadows.targetStack.animations;
		const { flightDuration, arcHeight } = baseConfig.games.aceOfShadows.animations;

		const stackHeight = this.targetStack.children.length;
		const rotateDirection = stackHeight > 50 ? -1 : 1;

		const tl = gsap.timeline({
			onComplete: () => {
				this.container.removeChild(card);
				this.targetStack.addChild(card);

				card.x = 0;
				card.y = -this.targetStack.children.length * baseConfig.games.aceOfShadows.targetStack.position.yOffset;

				const finalRot = card.rotation;
				card.rotation = gsap.utils.interpolate(finalRot, endRot, 0.5);

				hitEffect(
					this.targetStack,
					baseConfig.games.aceOfShadows.targetStack.animations.deck.hit
				);

				const popIndex = Math.floor(Math.random() * 6);
				SoundManager.play((	`POP${popIndex}_SOUND` as SoundKeys), 0.1);
			}
		});

		tl.to(card, {
			duration: flightDuration,
			x: endX,
			y: endY,
			rotation: endRot,
			ease: flying.ease,
			onUpdate: () => {
				const p = tl.progress();
				const arc = Math.sin(p * Math.PI) * arcHeight;
				card.y = gsap.utils.interpolate(localStart.y, endY, p) - arc;
			}
		}, 0);

		tl.to(card, {
			duration: flightDuration / 1.09,
			rotation: card.rotation + rotateDirection * (Math.PI * 2),
			ease: "power1.out"
		}, 0);

		tl.to(card.scale, {
			duration: flightDuration / 2,
			x: scaling.scale.to,
			y: scaling.scale.to,
			ease: scaling.ease.out
		}, 0);

		tl.to(card.scale, {
			duration: flightDuration / 2,
			x: scaling.scale.reset,
			y: scaling.scale.reset,
			ease: scaling.ease.in
		}, flightDuration / 2);
	}

	private deckLaunchEffect() {
		const stack = this.sourceStack;
		gsap.timeline()
			.to(stack.scale, {
				x: 0.98,
				y: 1.02,
				duration: 0.09,
				ease: "power1.in"
			})
			.to(stack.scale, {
				x: 1.05,
				y: 0.98,
				duration: 0.08,
				ease: "power2.out"
			})
			.to(stack.scale, {
				x: 1,
				y: 1,
				duration: 0.12,
				ease: "elastic.out(1, 0.4)"
			});
	}

	private onResize = () => {
		this.sourceStack.x = this.sourceStack.width / 2;
		this.targetStack.x = window.innerWidth - this.targetStack.width / 2;
		this.sourceStack.y = window.innerHeight - 100;
		this.targetStack.y = window.innerHeight - 100;
		this.backBtn.x = window.innerWidth - 100;
	}
}
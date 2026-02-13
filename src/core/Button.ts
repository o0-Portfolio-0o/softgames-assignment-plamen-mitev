import { Container, Sprite, Texture, Text } from "pixi.js";

export interface ButtonOptions {
	label: string;
	texture: Texture;
	textStyle: any;
	parentContainer: Container;
	onClick: () => void;
	position: {
		x: number;
		y: number;
	}
};

export class Button extends Container {
	constructor({ label, texture, textStyle, parentContainer, position, onClick }: ButtonOptions) {
		super();

		const background = new Sprite(texture);
		const text = new Text({ text: label, style: textStyle });
		background.anchor.set(0.5);
		text.anchor.set(0.5);
		this.addChild(background, text);

		this.eventMode = "static";
		this.cursor = "pointer";
		this.x = position.x;
		this.y = position.y;

		this.on("pointerover", () => {
			this.alpha = 0.8
			this.scale.set(1.05);
		});

		this.on("pointerout", () => {
			this.scale.set(1);
			this.alpha = 1
		});

		this.on("pointertap", () => onClick());

		parentContainer.addChild(this);
	}

}
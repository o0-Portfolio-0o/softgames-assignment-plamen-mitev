export const assetMap = {
	images: {
		card: "/assets/images/card.png",
		flame: "/assets/images/flame.png",
		button: "/assets/images/button.png",
		backButton: "/assets/images/backButton.png",
	},
	sounds: {
		pop0: "/assets/sounds/pop0.wav",
		pop1: "/assets/sounds/pop1.wav",
		pop2: "/assets/sounds/pop2.wav",
		pop3: "/assets/sounds/pop3.wav",
		pop4: "/assets/sounds/pop4.wav",
		pop5: "/assets/sounds/pop5.wav",
		notification: "/assets/sounds/notification.wav",
	}
} as const;

export type ImageKeys = keyof typeof assetMap.images;
export type SoundKeys = keyof typeof assetMap.sounds;

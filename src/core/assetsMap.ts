export const assetMap = {
	images: {
		card: "/assets/images/card.png",
		flame: "/assets/images/flame.png",
		button: "/assets/images/button.png",
		backButton: "/assets/images/backButton.png",
	},
	sounds: {
		POP0_SOUND: "/assets/sounds/pop0.wav",
		POP1_SOUND: "/assets/sounds/pop1.wav",
		POP2_SOUND: "/assets/sounds/pop2.wav",
		POP3_SOUND: "/assets/sounds/pop3.wav",
		POP4_SOUND: "/assets/sounds/pop4.wav",
		POP5_SOUND: "/assets/sounds/pop5.wav",
		NOTIFICATION_SOUND: "/assets/sounds/notification.wav",
	}
} as const;

export type ImageKeys = keyof typeof assetMap.images;
export type SoundKeys = keyof typeof assetMap.sounds;

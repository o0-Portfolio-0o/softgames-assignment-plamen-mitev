import { Texture } from "pixi.js";

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

async function loadRemoteTexture(url: string): Promise<Texture> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(Texture.from(img));
		img.onerror = () => reject( new Error("Failed to load " + url));
		img.src = url;
	});
}

export async function loadDialogueData(url: string) {
	const res = await fetch(url);
	const data: ApiData = await res.json();
	const emojiTextures = new Map<string, Texture>
	const avatarTextures = new Map<string, Texture>

	for (const emoji of data.emojies) {
		const texture = await loadRemoteTexture(emoji.url);
		emojiTextures.set(emoji.name, texture);
	}

	for (const avatar of data.avatars) {
		const texture = await loadRemoteTexture(avatar.url);
		avatarTextures.set(avatar.name, texture);
	}

	return { data, emojiTextures, avatarTextures };
}
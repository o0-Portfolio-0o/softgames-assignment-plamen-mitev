import { Howl } from 'howler';

export class SoundManager {
	private static sounds = new Map<string, Howl>();

	static load(name: string, src: string, volume = 1) {
		const sound = new Howl({ src: [src], volume });
		this.sounds.set(name, sound);
	}

	static play(name: string, volume: number) {
		const sound = this.sounds.get(name);
		if (!sound) return;

		if (volume !== undefined) {
			sound.volume(volume);
		}

		sound.play();
	}
}
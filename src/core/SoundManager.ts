import { Howl } from 'howler';
import { assetMap, SoundKeys } from './assetsMap';
export class SoundManager {
	public static sounds: Record<SoundKeys, Howl> = {} as Record<SoundKeys, Howl>;

	static play(name: SoundKeys, volume: number) {
		const sound = this.sounds[name];
		if (!sound) return;

		if (volume !== undefined) {
			sound.volume(volume);
		}

		sound.play();
	}

	static preload(volume = 0.5):Promise<void[]> {
		const promises = Object.entries(assetMap.sounds).map(([key, src]) => {
			return new Promise<void>((resolve, reject) => {
				const sound = new Howl({src,
					volume,
					onload: () => resolve(),
					onloaderror: (id, error) => reject(`Error loading ${key}: ${error}`),
				});
				this.sounds[key as SoundKeys] = sound;
			});
		});
		return Promise.all(promises);
	}
}
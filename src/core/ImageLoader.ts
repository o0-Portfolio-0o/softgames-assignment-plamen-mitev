import { Assets, Texture } from "pixi.js";
import { assetMap, ImageKeys } from "./assetsMap";

export class ImageLoader {
	public static loadAssets: Record<ImageKeys, Texture> = {} as Record<ImageKeys, Texture>;

	static async preload() {
		try {

			for (const [key, src] of Object.entries(assetMap.images)) {
				Assets.add({ alias: key, src });
			}
			const keys = Object.keys(assetMap.images);
			this.loadAssets = await Assets.load(keys);

			console.log("Images Loaded Successfully");

		} catch (error) {
			console.error("Error loading game images", error);

			throw error;
		}
	}
}
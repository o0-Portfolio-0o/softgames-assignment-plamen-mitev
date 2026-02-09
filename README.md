# Softgames Assignment

This project is a Pixi.js game application for the Softgames interview assignment.

## Structure
- `src/` — Main source code
- `assets/` — Game assets (images, sounds)
- `package.json` — Project dependencies

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the project:
   ```bash
   npm run dev
   ```

## Notes
- Game configuration is in `src/core/config.ts`.

## Future Improvements
There were a few enhancements I wanted to implement but couldn’t finish within the given time. I’m listing them here as potential improvements for future iterations:

- Show the back button immediately instead of waiting for the bubble animation to finish
- Fix an animation issue where bubble transitions bleed into other scenes
- Add support for multiple font styles
- Refine and polish the overall animations
- Introduce different background themes for each task
- Add hover effects to buttons
- Add an option to mute sound effects
- Add background music with volume control


## Game Developer Assignment
1. “Ace of Shadows”
Create 144 sprites (NOT graphic objects) that are stacked on top of each other like
cards in a deck. The top card must cover the bottom card, but not completely.
Every 1 second the top card should move to a different stack - the animation of the
movement should take 2 seconds.

2. “Magic Words”
Create a system that allows you to combine text and images like custom emojis.
Use it to render a dialogue between characters with the data taken from this
endpoint:
https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords

3. “Phoen ix Flame”
Make a particle-effect demo showing a great fire effect. Keep the number of
images at max 10 sprites on the screen at the same time.

Technical requirements:

✅ Write your code in TypeScript and use pixi.js (v7 or v8) for rendering.

✅ Each task should be accessed via an in-game menu.

✅ Render responsively for both mobile and desktop devices.

✅ Display the fps in the top left corner.

✅ Run the application in full screen.



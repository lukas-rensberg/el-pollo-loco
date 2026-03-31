# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**El Pollo Loco** is a browser-based 2D platformer built with vanilla ES6+ JavaScript, HTML5 Canvas, and CSS3 — no build step, no bundler, no package manager.

## Running locally

Open `index.html` directly in a browser, or serve it with a static server (required for ES module imports and root-relative font paths):

```
python -m http.server 8000
# or
npx http-server
```

There are no test files, no lint configuration, and no build commands.

## Architecture

### Entry point and startup sequence

`index.html` loads `js/game.js` as an ES module. Inline `onclick` handlers in the HTML call functions exported to `window` (e.g. `window.startGame`, `window.restartGame`).

Game startup: `startGame()` → `generateWorld()` → `createLevel1Objects()` → `new Level(...)` → `new World(canvas, keyboard, activeLevel)`.

### Class hierarchy

```
DrawableObject      — image loading, sprite caching (imgStore), frame cycling
  └─ MovableObject  — gravity, AABB collision, health/hurt/dead state
       ├─ Character
       ├─ Chicken / SmallChicken / Endboss
       └─ Cloud
```

`World` (`classes/world.class.js`) is the orchestration hub: it owns the player, current level, keyboard state, HUD bars, camera offset, collision polling, and the render loop. `Character` and enemies receive a back-reference to `World` via `world.setWorld()`.

### Game loop

There is **no central scheduler**. Each entity starts its own `setInterval` loop in its constructor (animation, gravity, AI). `World.checkCollisions()` runs at ~60 FPS via `setInterval`. The single `requestAnimationFrame` loop drives `World.draw()`.

On restart/game-over, cleanup is brute-force: interval IDs 1–9999 are cleared and the stored animation frame ID is cancelled. **Any new recurring timers must survive this pattern** — either by registering their IDs for explicit cleanup or by accepting they will be cleared.

### Rendering

`World.draw()` order: background layers → enemies → clouds → coins/bottles → character, then HUD is drawn after reversing the camera translation (`ctx.translate`). Camera position is `world.camera_x`, updated by `Character.animate()`.

Sprite flipping uses no separate assets: `World.addToMap()` temporarily negates `obj.x` when `obj.otherDirection` is true, draws, then restores. Follow this pattern for any new left/right-facing entity.

### Level format

`levels/level1.js` is a factory function (`createLevel1Objects()`) that returns fully instantiated objects. Tile width is **719 px**; `level_end_x` is `719 * 4 + 40`. The boss is placed at `719 * 4 + 600`.

### Collision handling

`World.isCharColliding()` iterates backwards over arrays so callbacks can safely `splice()` elements during iteration. Enemy death is two-phase: `enemy.kill()` zeroes health/speed, then the enemy is removed from `activeLevel.enemies` after 2 seconds.

### Audio and persistence

Audio objects are defined in `js/audio.js`. Mute state is persisted to `localStorage` (key `'mute'`).

## Conventions

- One default export per file; filenames are kebab-case, class files use `.class.js` suffix (e.g. `character.class.js`).
- Imports are relative and browser-native — no aliases or node resolution.
- HUD bars are image-driven via `StatusBar.setPercentage()`.
- `style.css` uses a root-relative font path (`url('/fonts/Rubik/Rubik.ttf')`), which requires the static server to be rooted at the project directory.

## Important notes

- **Treat the code as source of truth**, not `README.md`. The README describes an older structure (`js/models/`, `assets/`) that does not match the repo (`classes/`, `levels/`, `img/`).
- When changing DOM overlays or button wiring, verify IDs in `index.html` and selectors in `style.css` together (`#startScreen`, `#gameOverScreen`, `.d-none`).

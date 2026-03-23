import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

/**
 * This function is called when the player clicks the "Start Game" button on the start screen.
 * It hides the start screen and initializes the game world by calling `generateWorld()`,
 * which sets up the canvas and creates a new `World` instance with the level data.
 * This function serves as the entry point to begin gameplay.
 */
function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    generateWorld()
}

/**
 * This function is called when the player clicks the "Restart Game" button on the game over screen.
 * It clears all active intervals to stop any ongoing game processes,
 * hides the game over screen,
 * resets the keyboard input state,
 * and reinitializes the game world by calling `generateWorld()`.
 * This allows the player to start a new game session with a fresh state.
 */
function restartGame() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
    document.getElementById('gameOverScreen').classList.add('d-none');
    keyboard = new Keyboard();
    generateWorld()
}

/**
 * This function initializes the game world by setting up the canvas and creating a new `World` instance with the level data.
 * It retrieves the canvas element from the DOM, generates the level data using `createLevel1Objects()`,
 * and then creates a new `World` object with the canvas, keyboard input handler, and the active level data.
 * This function is called both at the start of the game and when restarting to ensure a fresh game state.
 */
function generateWorld() {
    canvas = document.getElementById("gameCanvas");
    let levelData = createLevel1Objects();
    let activeLevel = new Level(
        levelData.enemies,
        levelData.clouds,
        levelData.backgroundObjects,
        levelData.coins,
        levelData.levelEndX,
        levelData.bottles
    );
    world = new World(canvas, keyboard, activeLevel);
}

/**
 * Event listeners for keyboard input are set up to track when specific keys are pressed and released.
 */
window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "Space":
            keyboard.SPACE = true
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = true;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = true;
            break;
        case "KeyD":
            keyboard.KEY_D = true;
            break;
        default:
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "Space":
            keyboard.SPACE = false
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = false;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = false;
            break;
        case "KeyD":
            keyboard.KEY_D = false;
            break;
        default:
            break;
    }
});

/**
 * Exposes the `startGame` and `restartGame` functions to the global scope so they can be called from the HTML buttons.
 * @type {startGame}
 * @type {restartGame}
 */
window.startGame = startGame;
window.restartGame = restartGame;
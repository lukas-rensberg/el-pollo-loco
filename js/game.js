import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
const BG_MUSIC_VOLUME = 0.2;
const ICON_MUTED = 'img/10_game_icons/mute.svg';
const ICON_UNMUTED = 'img/10_game_icons/volume-on.svg';
let backgroundMusic = new Audio('audio/bg-music.mp3');
let isMuted = false;
let hasGameStarted = false;

backgroundMusic.loop = true;
backgroundMusic.volume = BG_MUSIC_VOLUME;

function updateMuteButtonIcon() {
    const muteIcon = document.getElementById('muteIcon');
    if (!muteIcon) return;

    muteIcon.src = isMuted ? ICON_MUTED : ICON_UNMUTED;
    muteIcon.alt = isMuted ? 'Ton aus' : 'Ton an';
}

function applyMuteState() {
    backgroundMusic.muted = isMuted;
    updateMuteButtonIcon();
}

function toggleMute(event) {
    if (event) {
        event.preventDefault();
        event.currentTarget.blur();
    }

    isMuted = !isMuted;
    applyMuteState();

    if (hasGameStarted && !isMuted && backgroundMusic.paused) {
        backgroundMusic.play().catch(() => {});
    }
}

function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    dialog.showModal();
}

function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialog.open) return;
    dialog.close();
}

function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
        dialog.close();
    });
}

/**
 * Starts background music from the beginning after a user interaction.
 */
function playBackgroundMusic() {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(() => {});
}

/**
 * This function is called when the player clicks the "Start Game" button on the start screen.
 * It hides the start screen and initializes the game world by calling `generateWorld()`,
 * which sets up the canvas and creates a new `World` instance with the level data.
 * This function serves as the entry point to begin gameplay.
 */
function startGame() {
    closeAllDialogs();
    document.getElementById('startScreen').classList.add('d-none');
    hasGameStarted = true;
    playBackgroundMusic();
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
    closeAllDialogs();
    document.getElementById('gameOverScreen').classList.add('d-none');
    keyboard = new Keyboard();
    hasGameStarted = true;
    playBackgroundMusic();
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
            event.preventDefault();
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
window.toggleMute = toggleMute;
window.openDialog = openDialog;
window.closeDialog = closeDialog;

applyMuteState();

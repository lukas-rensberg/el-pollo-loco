import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";
import {
    backgroundMusic, lostSound, winSound, coinSound, bottleSound, throwSound, walkingSound, hurtSound, chickenHitSound,
    applyMuteState, playBackgroundMusic, toggleMute
} from "./audio.js";
import {
    toggleFullscreen, maybeRequestFullscreenFromGesture, checkOrientation,
    refreshResponsiveLayout, canStartGameInCurrentOrientation,
    initTouchControls
} from "./input.js";
import { resetIdleTimer } from "./idle-timer.js";

let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;

/**
 * Opens the dialog with the given id if it is not already open.
 * @param {string} id - The DOM id of the dialog element.
 * @returns {void}
 */
function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    dialog.showModal();
}

/**
 * Closes the dialog with the given id if it is currently open.
 * @param {string} id - The DOM id of the dialog element.
 * @returns {void}
 */
function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialog.open) return;
    dialog.close();
}

/**
 * Closes all currently open dialog elements on the page.
 * @returns {void}
 */
function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
        dialog.close();
    });
}

/**
 * Sets the win-screen image to the default winning image.
 * @returns {void}
 */
function setWinScreenImage() {
    const winScreenImage = document.getElementById('winScreenImage');
    winScreenImage.src = 'img/You won, you lost/You Won B.png';
}

/**
 * Observes the win-screen element for class changes and refreshes the image
 * each time the screen becomes visible.
 * @returns {void}
 */
function initWinScreenImageRandomizer() {
    const winScreen = document.getElementById('win-screen');
    if (!winScreen) return;
    const observer = new MutationObserver(() => {
        if (!winScreen.classList.contains('d-none')) setWinScreenImage();
    });
    observer.observe(winScreen, { attributes: true, attributeFilter: ['class'] });
}

/**
 * Pauses and resets all sounds relevant to the win transition.
 * @returns {void}
 */
function stopAllSoundsOnWin() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
}

/**
 * Stops the session, plays the win sound, and shows the win screen.
 * @returns {void}
 */
function showWinScreen() {
    stopActiveGameSession();
    stopAllSoundsOnWin();
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.remove('d-none');
}

/**
 * Pauses and resets all sounds relevant to the game-over transition.
 * @returns {void}
 */
function stopAllSoundsOnGameOver() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    lostSound.play().catch(() => {});
}

/**
 * Stops the session, plays the lose sound, and shows the game-over screen.
 * @returns {void}
 */
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (!gameOverScreen || !gameOverScreen.classList.contains('d-none')) return;
    stopActiveGameSession();
    document.getElementById('win-screen').classList.add('d-none');
    stopAllSoundsOnGameOver();
    gameOverScreen.classList.remove('d-none');
}

/**
 * Stops the active world, cancels its animation frame, and clears all intervals.
 * @returns {void}
 */
function stopActiveGameSession() {
    if (world) {
        world.stopped = true;
        if (world.animationFrameId) {
            cancelAnimationFrame(world.animationFrameId);
            world.animationFrameId = null;
        }
    }
    walkingSound.pause();
    walkingSound.currentTime = 0;
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

/**
 * Starts the game if the current orientation allows it.
 * @returns {void}
 */
function startGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    closeAllDialogs();
    prepareGameStart();
}

/**
 * Restarts the game by stopping the current session and starting a fresh one.
 * @returns {void}
 */
function restartGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    stopActiveGameSession();
    closeAllDialogs();
    prepareGameStart();
}

/**
 * Hides all game overlay screens and removes the start-screen body class.
 * @returns {void}
 */
function hideGameScreens() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}

/**
 * Hides overlays, resets sounds and keyboard, then starts the game world.
 * @returns {void}
 */
function prepareGameStart() {
    hideGameScreens();
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    setWinScreenImage();
    keyboard.reset();
    hasGameStarted = true;
    playBackgroundMusic();
    generateWorld();
}

/**
 * Shows the start screen and hides all game-related overlay screens.
 * @returns {void}
 */
function showMainMenuScreens() {
    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}

/**
 * Pauses and resets all sounds for the main-menu transition.
 * @returns {void}
 */
function stopAllSoundsOnMenu() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
}

/**
 * Stops the active game session and returns the player to the main menu.
 * @returns {void}
 */
function backToMainMenu() {
    stopActiveGameSession();
    closeAllDialogs();
    showMainMenuScreens();
    keyboard.reset();
    hasGameStarted = false;
    stopAllSoundsOnMenu();
}

/**
 * Creates a {@link Level} instance from the Level 1 object factory.
 * @returns {Level}
 */
function createActiveLevel() {
    const levelData = createLevel1Objects();
    return new Level(
        levelData.enemies,
        levelData.clouds,
        levelData.backgroundObjects,
        levelData.coins,
        levelData.levelEndX,
        levelData.bottles
    );
}

/**
 * Creates the canvas reference, builds the active level, and wires all world sounds.
 * @returns {void}
 */
function generateWorld() {
    canvas = document.getElementById("gameCanvas");
    world = new World(canvas, keyboard, createActiveLevel());
    world.sounds = {
        coin: coinSound,
        bottle: bottleSound,
        throw: throwSound,
        walking: walkingSound,
        hurt: hurtSound,
        chickenHit: chickenHitSound
    };
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

window.addEventListener("keydown", (event) => {
    resetIdleTimer();
    switch (event.code) {
        case "Space":
            event.preventDefault();
            keyboard.SPACE = true;
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
            keyboard.SPACE = false;
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

window.startGame = startGame;
window.restartGame = restartGame;
window.backToMainMenu = backToMainMenu;
window.toggleMute = (event) => toggleMute(event, hasGameStarted);
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.showWinScreen = showWinScreen;
window.showGameOverScreen = showGameOverScreen;

const fullscreenButton = document.getElementById('fullscreen-btn');
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullscreen);
}

initTouchControls(keyboard);
initWinScreenImageRandomizer();
checkOrientation();
refreshResponsiveLayout();
applyMuteState();
setWinScreenImage();

['click', 'touchstart', 'mousemove'].forEach(type =>
    document.addEventListener(type, resetIdleTimer, { passive: true })
);

window.addEventListener('resize', refreshResponsiveLayout);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => setTimeout(() => {
    refreshResponsiveLayout();
    checkOrientation();
}, 50));

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
const MOBILE_BREAKPOINT = 720;
const FULLSCREEN_MIN_WIDTH = 640;
const FULLSCREEN_MIN_HEIGHT = 360;
const WIN_SCREEN_IMAGES = [
    'img/You won, you lost/You Win A.png',
    'img/You won, you lost/You win B.png',
    'img/You won, you lost/You won A.png',
    'img/You won, you lost/You Won B.png'
];
let backgroundMusic = new Audio('audio/bg-music.mp3');
let isMuted = false;
let hasGameStarted = false;
let touchControlsInitialized = false;
let shouldRequestFullscreen = false;
let lastWinScreenImageIndex = -1;

try {
    isMuted = localStorage.getItem('mute') === 'true';
} catch (_) {
    isMuted = false;
}

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
    try {
        localStorage.setItem('mute', String(isMuted));
    } catch (_) {
        // Ignore storage errors (e.g. private mode or blocked storage).
    }
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

function setRandomWinScreenImage() {
    const winScreenImage = document.getElementById('winScreenImage');
    if (!winScreenImage || WIN_SCREEN_IMAGES.length === 0) return;

    let randomIndex = Math.floor(Math.random() * WIN_SCREEN_IMAGES.length);
    if (WIN_SCREEN_IMAGES.length > 1) {
        while (randomIndex === lastWinScreenImageIndex) {
            randomIndex = Math.floor(Math.random() * WIN_SCREEN_IMAGES.length);
        }
    }

    lastWinScreenImageIndex = randomIndex;
    winScreenImage.src = WIN_SCREEN_IMAGES[randomIndex];
}

function initWinScreenImageRandomizer() {
    const winScreen = document.getElementById('win-screen');
    if (!winScreen) return;

    const winScreenClassObserver = new MutationObserver(() => {
        if (!winScreen.classList.contains('d-none')) {
            setRandomWinScreenImage();
        }
    });

    winScreenClassObserver.observe(winScreen, {
        attributes: true,
        attributeFilter: ['class']
    });
}

function showWinScreen() {
    stopActiveGameSession();
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.remove('d-none');
}

function stopActiveGameSession() {
    if (world) {
        world.stopped = true;
        if (world.animationFrameId) {
            cancelAnimationFrame(world.animationFrameId);
            world.animationFrameId = null;
        }
    }

    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}

function isMobileViewport() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
        window.matchMedia('(pointer: coarse)').matches;
}

function isTouchDevice() {
    return 'ontouchstart' in window;
}

function isPortraitOrientation() {
    return window.matchMedia('(orientation: portrait)').matches;
}

function isLandscapePlayfieldTooSmall() {
    if (!isMobileViewport() || isPortraitOrientation()) return false;

    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return false;

    const rect = gameContainer.getBoundingClientRect();
    return rect.width < FULLSCREEN_MIN_WIDTH || rect.height < FULLSCREEN_MIN_HEIGHT;
}

function getFullscreenTarget() {
    return document.getElementById('gameContainer');
}

function updateFullscreenRequestState() {
    shouldRequestFullscreen = isLandscapePlayfieldTooSmall() && !document.fullscreenElement;
}

function requestFullscreenBestEffort() {
    const fullscreenTarget = getFullscreenTarget();
    if (!fullscreenTarget || !fullscreenTarget.requestFullscreen || document.fullscreenElement) {
        return Promise.resolve(false);
    }

    return fullscreenTarget.requestFullscreen()
        .then(() => true)
        .catch(() => false);
}

function toggleFullscreen() {
    const fullscreenTarget = getFullscreenTarget();
    if (!fullscreenTarget || !fullscreenTarget.requestFullscreen) return;

    if (!document.fullscreenElement) {
        fullscreenTarget.requestFullscreen().catch(() => {});
        return;
    }
    document.exitFullscreen().catch(() => {});
}

function maybeRequestFullscreenFromGesture() {
    if (!shouldRequestFullscreen) return;

    requestFullscreenBestEffort().finally(() => {
        updateFullscreenRequestState();
    });
}

function updateViewportHeightUnit() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--safe-vh', `${vh}px`);
}

function checkOrientation() {
    const rotateWarning = document.getElementById('rotate-warning');
    const gameCanvas = document.getElementById('gameCanvas');
    if (!rotateWarning || !gameCanvas) return;


    const showWarning = isMobileViewport() && window.innerHeight > window.innerWidth;
    rotateWarning.style.display = showWarning ? 'flex' : 'none';

    const isSmallLandscape = window.matchMedia('(orientation: landscape)').matches && window.innerHeight < 480;
    gameCanvas.classList.toggle('canvas--small-landscape', isSmallLandscape);
}

function updateMobileLayoutState() {
    const isMobile = isTouchDevice();
    const isPortrait = isPortraitOrientation();
    const showTouchControls = isMobile && !isPortrait;

    document.body.classList.toggle('mobile-controls-visible', showTouchControls);

    const touchControls = document.getElementById('mobile-controls');
    if (touchControls) {
        touchControls.classList.toggle('d-none', !showTouchControls);
    }
}

function canStartGameInCurrentOrientation() {
    updateMobileLayoutState();
    return !(isMobileViewport() && isPortraitOrientation());
}

function refreshResponsiveLayout() {
    updateViewportHeightUnit();
    checkOrientation();
    updateMobileLayoutState();
    updateFullscreenRequestState();
}

function bindTouchControl(buttonId, onPress, onRelease) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    button.addEventListener('touchstart', (event) => {
        event.preventDefault();
        maybeRequestFullscreenFromGesture();
        onPress();
    }, { passive: false });

    button.addEventListener('touchend', (event) => {
        event.preventDefault();
        onRelease();
    }, { passive: false });

    button.addEventListener('touchcancel', (event) => {
        event.preventDefault();
        onRelease();
    }, { passive: false });

    button.addEventListener('mousedown', () => {
        maybeRequestFullscreenFromGesture();
        onPress();
    });
    button.addEventListener('mouseup', onRelease);
    button.addEventListener('mouseleave', onRelease);
}

function initTouchControls() {
    if (touchControlsInitialized) return;

    bindTouchControl('btn-left',
        () => keyboard.LEFT_ARROW = true,
        () => keyboard.LEFT_ARROW = false);

    bindTouchControl('btn-right',
        () => keyboard.RIGHT_ARROW = true,
        () => keyboard.RIGHT_ARROW = false);

    bindTouchControl('btn-jump',
        () => keyboard.SPACE = true,
        () => keyboard.SPACE = false);

    bindTouchControl('btn-throw',
        () => keyboard.KEY_D = true,
        () => keyboard.KEY_D = false);

    touchControlsInitialized = true;
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
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    closeAllDialogs();
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    setRandomWinScreenImage();
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
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    stopActiveGameSession();
    closeAllDialogs();
    document.body.classList.remove('game-start-screen');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    setRandomWinScreenImage();
    keyboard = new Keyboard();
    hasGameStarted = true;
    playBackgroundMusic();
    generateWorld()
}

function backToMainMenu() {
    stopActiveGameSession();
    closeAllDialogs();

    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');

    keyboard = new Keyboard();
    hasGameStarted = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
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

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

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
window.backToMainMenu = backToMainMenu;
window.toggleMute = toggleMute;
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.showWinScreen = showWinScreen;

const fullscreenButton = document.getElementById('fullscreen-btn');
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullscreen);
}

initTouchControls();
initWinScreenImageRandomizer();
checkOrientation();
refreshResponsiveLayout();
applyMuteState();
setRandomWinScreenImage();

window.addEventListener('resize', refreshResponsiveLayout);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => setTimeout(() => {
    refreshResponsiveLayout();
    checkOrientation();

    if (hasGameStarted && isMobileViewport() && !isPortraitOrientation()) {
        requestFullscreenBestEffort().finally(() => {
            updateFullscreenRequestState();
        });
    }
}, 50));
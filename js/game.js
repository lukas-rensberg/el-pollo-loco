import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";
import {
    backgroundMusic, lostSound, winSound, coinSound, bottleSound, throwSound, walkingSound,
    isMuted, setMuted, applyMuteState, playBackgroundMusic
} from "./audio.js";
import {
    toggleFullscreen, maybeRequestFullscreenFromGesture, checkOrientation,
    refreshResponsiveLayout, canStartGameInCurrentOrientation,
    initTouchControls, tryEnterFullscreenInLandscape
} from "./input.js";
import { resetIdleTimer } from "./idle-timer.js";

let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;
let lastWinScreenImageIndex = -1;

const WIN_SCREEN_IMAGES = [
    'img/You won, you lost/You Win A.png',
    'img/You won, you lost/You win B.png',
    'img/You won, you lost/You won A.png',
    'img/You won, you lost/You Won B.png'
];

function toggleMute(event) {
    if (event) {
        event.preventDefault();
        event.currentTarget.blur();
    }

    setMuted(!isMuted);
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
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.remove('d-none');
}

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (!gameOverScreen || !gameOverScreen.classList.contains('d-none')) return;

    stopActiveGameSession();
    document.getElementById('win-screen').classList.add('d-none');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    lostSound.play().catch(() => {});
    gameOverScreen.classList.remove('d-none');
}

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

function startGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    closeAllDialogs();
    prepareGameStart();
}

function restartGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    stopActiveGameSession();
    closeAllDialogs();
    prepareGameStart();
    generateWorld();
}

function prepareGameStart() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    setRandomWinScreenImage();
    keyboard = new Keyboard();
    hasGameStarted = true;
    playBackgroundMusic();
    generateWorld();
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
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
}

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
    world.sounds = {
        coin: coinSound,
        bottle: bottleSound,
        throw: throwSound,
        walking: walkingSound
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
window.toggleMute = toggleMute;
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
setRandomWinScreenImage();

['click', 'touchstart', 'mousemove'].forEach(type =>
    document.addEventListener(type, resetIdleTimer, { passive: true })
);

window.addEventListener('resize', refreshResponsiveLayout);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => setTimeout(() => {
    refreshResponsiveLayout();
    checkOrientation();
    tryEnterFullscreenInLandscape();
}, 50));

const MOBILE_BREAKPOINT = 720;
const FULLSCREEN_MIN_WIDTH = 640;
const FULLSCREEN_MIN_HEIGHT = 360;

let shouldRequestFullscreen = false;
let touchControlsInitialized = false;

export function isMobileViewport() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
        window.matchMedia('(pointer: coarse)').matches;
}

export function isTouchDevice() {
    return 'ontouchstart' in window;
}

export function isPortraitOrientation() {
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

export function tryEnterFullscreenInLandscape() {
    if (!isMobileViewport() || isPortraitOrientation()) return;

    requestFullscreenBestEffort().finally(() => {
        updateFullscreenRequestState();
    });
}

export function toggleFullscreen() {
    const fullscreenTarget = getFullscreenTarget();
    if (!fullscreenTarget || !fullscreenTarget.requestFullscreen) return;

    if (!document.fullscreenElement) {
        fullscreenTarget.requestFullscreen().catch(() => {});
        return;
    }
    document.exitFullscreen().catch(() => {});
}

export function maybeRequestFullscreenFromGesture() {
    if (!shouldRequestFullscreen) return;

    requestFullscreenBestEffort().finally(() => {
        updateFullscreenRequestState();
    });
}

export function updateViewportHeightUnit() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--safe-vh', `${vh}px`);
}

export function checkOrientation() {
    const rotateWarning = document.getElementById('rotate-warning');
    const gameCanvas = document.getElementById('gameCanvas');
    if (!rotateWarning || !gameCanvas) return;

    const showWarning = isMobileViewport() && window.innerHeight > window.innerWidth;
    rotateWarning.style.display = showWarning ? 'flex' : 'none';

    if (isMobileViewport() && !isPortraitOrientation()) {
        const controlsDialog = document.getElementById('controlsDialog');
        if (controlsDialog?.open) controlsDialog.close();
    }

    const isSmallLandscape = window.matchMedia('(orientation: landscape)').matches && window.innerHeight < 480;
    gameCanvas.classList.toggle('canvas--small-landscape', isSmallLandscape);
}

export function updateMobileLayoutState() {
    const isMobile = isTouchDevice();
    const isPortrait = isPortraitOrientation();
    const showTouchControls = isMobile && !isPortrait;

    document.body.classList.toggle('mobile-controls-visible', showTouchControls);

    const touchControls = document.getElementById('mobile-controls');
    if (touchControls) {
        touchControls.classList.toggle('d-none', !showTouchControls);
    }
}

export function canStartGameInCurrentOrientation() {
    updateMobileLayoutState();
    return !(isMobileViewport() && isPortraitOrientation());
}

export function refreshResponsiveLayout() {
    updateViewportHeightUnit();
    checkOrientation();
    updateMobileLayoutState();
    updateFullscreenRequestState();
    tryEnterFullscreenInLandscape();
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

export function initTouchControls(keyboard) {
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

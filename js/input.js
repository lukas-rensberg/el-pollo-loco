const MOBILE_BREAKPOINT = 720;
const FULLSCREEN_MIN_WIDTH = 640;
const FULLSCREEN_MIN_HEIGHT = 360;

let shouldRequestFullscreen = false;
let touchControlsInitialized = false;

/**
 * Returns true when the viewport width is at or below the mobile breakpoint,
 * or when the primary pointer is coarse (touch device).
 * @returns {boolean}
 */
export function isMobileViewport() {
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ||
        window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Returns true when the device supports touch events.
 * @returns {boolean}
 */
export function isTouchDevice() {
    return 'ontouchstart' in window;
}

/**
 * Returns true when the viewport is in portrait orientation.
 * @returns {boolean}
 */
export function isPortraitOrientation() {
    return window.matchMedia('(orientation: portrait)').matches;
}

/**
 * Returns true when the game container is too small to play comfortably
 * in landscape without fullscreen.
 * @returns {boolean}
 */
function isLandscapePlayfieldTooSmall() {
    if (!isMobileViewport() || isPortraitOrientation()) return false;

    const gameContainer = document.getElementById('gameContainer');
    if (!gameContainer) return false;

    const rect = gameContainer.getBoundingClientRect();
    return rect.width < FULLSCREEN_MIN_WIDTH || rect.height < FULLSCREEN_MIN_HEIGHT;
}

/**
 * Returns the element that should be made fullscreen (the game container).
 * @returns {HTMLElement|null}
 */
function getFullscreenTarget() {
    return document.getElementById('gameContainer');
}

/**
 * Updates the module-level {@link shouldRequestFullscreen} flag based on
 * current viewport and fullscreen state.
 * @returns {void}
 */
function updateFullscreenRequestState() {
    shouldRequestFullscreen = isLandscapePlayfieldTooSmall() && !document.fullscreenElement;
}

/**
 * Requests fullscreen on the game container, ignoring errors silently.
 * @returns {Promise<boolean>} Resolves to true if fullscreen was granted.
 */
function requestFullscreenBestEffort() {
    const fullscreenTarget = getFullscreenTarget();
    if (!fullscreenTarget || !fullscreenTarget.requestFullscreen || document.fullscreenElement) {
        return Promise.resolve(false);
    }

    return fullscreenTarget.requestFullscreen()
        .then(() => true)
        .catch(() => false);
}

/**
 * Attempts to enter fullscreen when in a small landscape viewport.
 * No-op on portrait or desktop.
 * @returns {void}
 */
export function tryEnterFullscreenInLandscape() {
    if (!isMobileViewport() || isPortraitOrientation()) return;

    requestFullscreenBestEffort().finally(() => {
        updateFullscreenRequestState();
    });
}

/**
 * Toggles the game container between fullscreen and normal mode.
 * @returns {void}
 */
export function toggleFullscreen() {
    const fullscreenTarget = getFullscreenTarget();
    if (!fullscreenTarget || !fullscreenTarget.requestFullscreen) return;

    if (!document.fullscreenElement) {
        fullscreenTarget.requestFullscreen().catch(() => {});
        return;
    }
    document.exitFullscreen().catch(() => {});
}

/**
 * Requests fullscreen only when the flag set by {@link updateFullscreenRequestState}
 * indicates it is needed. Called on user gesture events (e.g. game start).
 * @returns {void}
 */
export function maybeRequestFullscreenFromGesture() {
    if (!shouldRequestFullscreen) return;

    requestFullscreenBestEffort().finally(() => {
        updateFullscreenRequestState();
    });
}

/**
 * Sets the CSS custom property `--safe-vh` to 1 % of the current inner height.
 * Used to work around the mobile browser address-bar resize problem.
 * @returns {void}
 */
export function updateViewportHeightUnit() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--safe-vh', `${vh}px`);
}

/**
 * Shows or hides the rotate-warning overlay and adjusts the canvas class
 * for small-landscape viewports.
 * @returns {void}
 */
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

/**
 * Syncs the `mobile-controls-visible` body class and the visibility of the
 * touch-controls panel to the current device / orientation combination.
 * @returns {void}
 */
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

/**
 * Returns true when the user is allowed to start or continue a game in the
 * current orientation (i.e. not a mobile device in portrait mode).
 * @returns {boolean}
 */
export function canStartGameInCurrentOrientation() {
    updateMobileLayoutState();
    return !(isMobileViewport() && isPortraitOrientation());
}

/**
 * Recalculates viewport height unit, orientation state, mobile layout, and
 * fullscreen eligibility. Should be called on resize and orientationchange.
 * @returns {void}
 */
export function refreshResponsiveLayout() {
    updateViewportHeightUnit();
    checkOrientation();
    updateMobileLayoutState();
    updateFullscreenRequestState();
    tryEnterFullscreenInLandscape();
}

/**
 * Attaches touchstart, touchend, touchcancel, mousedown, mouseup, and mouseleave
 * listeners to a touch-control button element.
 * @param {string} buttonId - The DOM id of the button element.
 * @param {Function} onPress - Callback fired when the button is pressed.
 * @param {Function} onRelease - Callback fired when the button is released.
 * @returns {void}
 */
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

/**
 * Wires the four on-screen touch buttons (left, right, jump, throw) to the
 * shared {@link Keyboard} state object. Runs only once; subsequent calls are
 * no-ops due to the {@link touchControlsInitialized} guard.
 * @param {Keyboard} keyboard - The shared input-state object.
 * @returns {void}
 */
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

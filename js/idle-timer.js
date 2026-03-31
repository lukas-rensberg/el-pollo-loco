/** Milliseconds of inactivity before the character enters sleep state. */
const SLEEP_THRESHOLD_MS = 15_000;

let lastInteractionTime = Date.now();

/**
 * Resets the idle timer to the current moment.
 * Call this on every user interaction (keydown, click, touchstart, mousemove).
 * @returns {void}
 */
export function resetIdleTimer() {
    lastInteractionTime = Date.now();
}

/**
 * Returns true if the user has been inactive for at least {@link SLEEP_THRESHOLD_MS}.
 * @returns {boolean} True when the character should play its sleep animation.
 */
export function isIdle() {
    return Date.now() - lastInteractionTime >= SLEEP_THRESHOLD_MS;
}

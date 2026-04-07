const BG_MUSIC_VOLUME = 0.05;
const LOST_SOUND_VOLUME = 0.5;
const WIN_SOUND_VOLUME = 0.5;
const COIN_SOUND_VOLUME = 0.2;
const BOTTLE_SOUND_VOLUME = 0.2;
const THROW_SOUND_VOLUME = 0.3;
const WALKING_SOUND_VOLUME = 1.0;
const HURT_SOUND_VOLUME = 0.5;
const CHICKEN_HIT_VOLUME = 0.6;
const ICON_MUTED = 'img/10_game_icons/mute.svg';
const ICON_UNMUTED = 'img/10_game_icons/volume-on.svg';

export let backgroundMusic = new Audio('audio/bg-music.mp3');
export let lostSound = new Audio('audio/lost.mp3');
export let winSound = new Audio('audio/win.mp3');
export let coinSound = new Audio('audio/coin.mp3');
export let bottleSound = new Audio('audio/bottle.mp3');
export let throwSound = new Audio('audio/throw.mp3');
export let walkingSound = new Audio('audio/pepe-walking.mp3');
export let hurtSound = new Audio('audio/hurt.mp3');
export let chickenHitSound = new Audio('audio/chicken_hit.mp3');

/** Whether all game audio is currently muted. Persisted to localStorage. */
export let isMuted = false;

try {
    isMuted = localStorage.getItem('mute') === 'true';
} catch (_) {
    isMuted = false;
}

backgroundMusic.loop = true;
backgroundMusic.volume = BG_MUSIC_VOLUME;
lostSound.loop = false;
lostSound.volume = LOST_SOUND_VOLUME;
winSound.loop = false;
winSound.volume = WIN_SOUND_VOLUME;
coinSound.volume = COIN_SOUND_VOLUME;
bottleSound.volume = BOTTLE_SOUND_VOLUME;
throwSound.volume = THROW_SOUND_VOLUME;
walkingSound.loop = true;
walkingSound.volume = WALKING_SOUND_VOLUME;
hurtSound.loop = false;
hurtSound.volume = HURT_SOUND_VOLUME;
chickenHitSound.loop = false;
chickenHitSound.volume = CHICKEN_HIT_VOLUME;

/**
 * Swaps the mute button icon to reflect the current {@link isMuted} state.
 * @returns {void}
 */
function updateMuteButtonIcon() {
    const muteIcon = document.getElementById('muteIcon');
    if (!muteIcon) return;

    muteIcon.src = isMuted ? ICON_MUTED : ICON_UNMUTED;
    muteIcon.alt = isMuted ? 'Ton aus' : 'Ton an';
}

/**
 * Mutes or unmutes every audio object and updates the mute button icon.
 * Call this whenever {@link isMuted} changes.
 * @returns {void}
 */
export function applyMuteState() {
    backgroundMusic.muted = isMuted;
    lostSound.muted = isMuted;
    winSound.muted = isMuted;
    coinSound.muted = isMuted;
    bottleSound.muted = isMuted;
    throwSound.muted = isMuted;
    walkingSound.muted = isMuted;
    hurtSound.muted = isMuted;
    chickenHitSound.muted = isMuted;
    updateMuteButtonIcon();
}

/**
 * Resets {@link backgroundMusic} to the beginning and starts playback.
 * Errors (e.g., autoplay policy) are silently ignored.
 * @returns {void}
 */
export function playBackgroundMusic() {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(() => {});
}

/**
 * Sets the module-level {@link isMuted} flag.
 * After calling this, invoke {@link applyMuteState} to propagate the change
 * to all audio objects.
 * @param {boolean} value - True to mute, false to unmute.
 * @returns {void}
 */
export function setMuted(value) {
    isMuted = value;
}

/**
 * Saves the current mute state to localStorage, ignoring storage errors.
 * @returns {void}
 */
export function persistMuteState() {
    try {
        localStorage.setItem('mute', String(isMuted));
    } catch (_) {
        // Ignore storage errors (e.g. private mode or blocked storage).
    }
}

/**
 * Resumes background music if the game is running and audio is unmuted.
 * @param {boolean} hasGameStarted - Whether a game session is currently active.
 * @returns {void}
 */
export function resumeMusicIfNeeded(hasGameStarted) {
    if (hasGameStarted && !isMuted && backgroundMusic.paused) {
        backgroundMusic.play().catch(() => {});
    }
}

/**
 * Toggles audio mute state, persists it, and resumes music if applicable.
 * @param {Event|null} event - Optional click event; blur is called to clear focus ring.
 * @param {boolean} hasGameStarted - Whether a game session is currently active.
 * @returns {void}
 */
export function toggleMute(event, hasGameStarted) {
    if (event) {
        event.preventDefault();
        event.currentTarget.blur();
    }
    setMuted(!isMuted);
    persistMuteState();
    applyMuteState();
    resumeMusicIfNeeded(hasGameStarted);
}

const BG_MUSIC_VOLUME = 0.08;
const LOST_SOUND_VOLUME = 0.5;
const WIN_SOUND_VOLUME = 0.5;
const COIN_SOUND_VOLUME = 0.2;
const BOTTLE_SOUND_VOLUME = 0.2;
const THROW_SOUND_VOLUME = 0.3;
const WALKING_SOUND_VOLUME = 0.3;
const ICON_MUTED = 'img/10_game_icons/mute.svg';
const ICON_UNMUTED = 'img/10_game_icons/volume-on.svg';

export let backgroundMusic = new Audio('audio/bg-music.mp3');
export let lostSound = new Audio('audio/lost.mp3');
export let winSound = new Audio('audio/win.mp3');
export let coinSound = new Audio('audio/coin.mp3');
export let bottleSound = new Audio('audio/bottle.mp3');
export let throwSound = new Audio('audio/throw.mp3');
export let walkingSound = new Audio('audio/pepe-walking.mp3');

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

function updateMuteButtonIcon() {
    const muteIcon = document.getElementById('muteIcon');
    if (!muteIcon) return;

    muteIcon.src = isMuted ? ICON_MUTED : ICON_UNMUTED;
    muteIcon.alt = isMuted ? 'Ton aus' : 'Ton an';
}

export function applyMuteState() {
    backgroundMusic.muted = isMuted;
    lostSound.muted = isMuted;
    winSound.muted = isMuted;
    coinSound.muted = isMuted;
    bottleSound.muted = isMuted;
    throwSound.muted = isMuted;
    walkingSound.muted = isMuted;
    updateMuteButtonIcon();
}

export function playBackgroundMusic() {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(() => {});
}

export function setMuted(value) {
    isMuted = value;
}

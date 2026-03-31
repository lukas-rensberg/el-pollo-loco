import MovableObject from "./movable-object.class.js";

/**
 * The level's final boss — a giant chicken.
 * Stays still until the character enters the boss arena (detected via
 * {@link Character#isNearBoss}), then charges left at full speed.
 */
export default class Endboss extends MovableObject {
    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ]
    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png"
    ]
    height = 325
    width = 275
    y = 130
    speed = 1
    hasBeenTriggered = false

    /**
     * Loads walking sprites, positions the boss at the given x coordinate,
     * and starts animation and trigger-detection loops.
     * @param {number} x - Horizontal starting position within the level.
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x;

        this.animate();
    }

    /**
     * Starts two independent intervals:
     * 1. Sprite interval (200 ms) — cycles walking frames continuously.
     * 2. Movement interval (60 FPS) — waits until the character is near the boss,
     *    then moves left every tick until defeated.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);

        setInterval(() => {
            if (!this.world) return;
            if (this.world.character.isNearBoss()) {
                this.hasBeenTriggered = true;
            }
            if (!this.hasBeenTriggered) return;
            this.moveLeft();
        }, 1000 / 60);
    }
}

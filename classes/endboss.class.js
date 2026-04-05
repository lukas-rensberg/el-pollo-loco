import MovableObject from "./movable-object.class.js";

/**
 * The level's final boss — a giant chicken.
 * Stays still until the character enters the boss arena (detected via
 * {@link Character#isNearBoss}), then charges left at full speed.
 * Plays hurt/dead animations and bounces back on hit.
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
    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ]
    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png",
    ]
    height = 325
    width = 275
    y = 130
    hitboxW = 280;
    hitboxH = 280;
    speed = 3
    hasBeenTriggered = false
    knockbackActive = false

    /**
     * Loads all sprite sheets, positions the boss, and starts loops.
     * @param {number} x - Horizontal starting position within the level.
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.animate();
    }

    animate() {
        this.startSpriteInterval();
        this.startMovementInterval();
    }

    /**
     * Animation priority: dead > hurt > alert intro > walking.
     */
    startSpriteInterval() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.hasBeenTriggered) {
                const alertDone = this.currentImage >= this.IMAGES_ALERT.length;
                this.playAnimation(alertDone ? this.IMAGES_WALKING : this.IMAGES_ALERT);
            }
        }, 100);
    }

    /**
     * Moves left each tick; paused during knockback or while dead.
     */
    startMovementInterval() {
        setInterval(() => {
            if (!this.world || this.isDead() || this.knockbackActive) return;
            if (this.world.character.isNearBoss()) this.hasBeenTriggered = true;
            if (this.hasBeenTriggered && this.currentImage >= this.IMAGES_ALERT.length) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Applies damage and triggers a knockback arc on every non-lethal hit.
     * @param {number} damage
     */
    hit(damage) {
        super.hit(damage);
        if (!this.isDead()) this.startKnockback();
    }

    /**
     * Launches a parabolic jump upward and drifts the boss to the right.
     * Uses a time-based arc so it never conflicts with the gravity system.
     * @returns {void}
     */
    startKnockback() {
        if (this.knockbackActive) return;
        this.knockbackActive = true;

        const startY  = this.y;
        const startX  = this.x;
        const arcHeight  = 70;
        const driftRight = 55;
        const duration   = 500;
        const t0 = Date.now();

        const interval = setInterval(() => {
            const t = (Date.now() - t0) / duration;
            if (t >= 1) {
                this.y = startY;
                this.x = startX + driftRight;
                this.knockbackActive = false;
                clearInterval(interval);
                return;
            }
            this.y = startY - arcHeight * 4 * t * (1 - t);
            this.x = startX + driftRight * t;
        }, 1000 / 60);
    }
}

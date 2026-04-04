import DrawableObject from "./drawable-object.class.js";

/**
 * Extends {@link DrawableObject} with physics (gravity, movement), collision detection, and a health / hurt / dead state machine.
 * All interactive game entities (character, enemies, projectiles) are extensions to this class.
 */
/** Y coordinate of the shared visual ground line (canvas bottom minus floor height). */
export const GROUND_Y = 430;

export default class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;
    gravityInterval = null;

    constructor() {
        super();
    }

    /**
     * Starts a repeating gravity interval that decreases {@link speedY} each tick,
     * pulling the object downward until it reaches ground level.
     * Clears any previously running gravity interval before starting a new one.
     * @returns {void}
     */
    applyGravity() {
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Returns true when the object's bottom edge is above the ground baseline.
     * Uses {@link GROUND_Y} so the check is correct for any entity height.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y + this.height < GROUND_Y;
    }

    /**
     * Moves the object to the right by its {@link speed} value.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its {@link speed} value.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * AABB collision check using each object's hitbox (hbLeft/hbTop/hbWidth/hbHeight).
     * @param {DrawableObject} obj - The object to test for overlap.
     * @returns {boolean} True if the two hitboxes intersect.
     */
    isColliding(obj) {
        return this.hbLeft + this.hbWidth  > obj.hbLeft &&
               this.hbTop  + this.hbHeight > obj.hbTop  &&
               this.hbLeft                 < obj.hbLeft + obj.hbWidth &&
               this.hbTop                  < obj.hbTop  + obj.hbHeight;
    }

    /**
     * Gives the object an upward vertical velocity, initiating a jump arc.
     * @returns {void}
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Subtracts damage from {@link health} and records the timestamp of the hit
     * so {@link isHurt} can determine the hurt window.
     * Health is clamped to a minimum of 0.
     * @param {number} damage - Number of health points to subtract.
     * @returns {void}
     */
    hit(damage) {
        this.health -= damage;

        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Returns true when the object's health has reached zero.
     * @returns {boolean}
     */
    isDead() {
        return this.health === 0;
    }

    /**
     * Returns true within 0.5 seconds of the last call to {@link hit}.
     * Used to prevent repeated damage and to select the hurt animation.
     * @returns {boolean}
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
}

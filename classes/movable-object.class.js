import DrawableObject from "./drawable-object.class.js";

/**
 * Extends {@link DrawableObject} with physics (gravity, movement),
 * AABB collision detection, and a health / hurt / dead state machine.
 * All interactive game entities (character, enemies, projectiles) extend this class.
 */
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
     * pulling the object downward until it reaches ground level (y >= 129).
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
     * Draws a blue debug bounding-box rectangle around the object.
     * Called by {@link World#addToMap} for Character, Chicken, and SmallChicken.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     * @returns {void}
     */
    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Returns true when the object is above the ground baseline (y < 129).
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < 129;
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
     * AABB (axis-aligned bounding box) collision check against another drawable object.
     * @param {DrawableObject} obj - The object to test for overlap.
     * @returns {boolean} True if the two bounding boxes intersect.
     */
    isColliding(obj) {
        return this.x + this.width > obj.x &&
            this.y + this.height > obj.y &&
            this.x < obj.x + obj.width &&
            this.y < obj.y + obj.height;
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
     * @param {number} damage - Amount of health points to subtract.
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

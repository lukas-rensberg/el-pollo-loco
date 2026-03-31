import MovableObject from "./movable-object.class.js";

/**
 * Base class for throwable projectiles.
 * Handles arc physics (via inherited {@link MovableObject#applyGravity}),
 * rotation animation while in flight, and a multi-frame splash sequence on impact.
 * After the splash completes, {@link markedForRemoval} is set so {@link World}
 * can prune the object from the throwable-bottles array.
 */
export default class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];
    IMAGES_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];
    GROUND_Y = 350;
    width = 50;
    height = 50;
    isBroken = false;
    markedForRemoval = false;
    rotationInterval = null;
    moveInterval = null;
    splashInterval = null;
    speedY = 30;
    speed = 10;

    /**
     * Preloads rotation and splash sprites, then launches the projectile.
     * @param {number} startX - Horizontal launch position.
     * @param {number} startY - Vertical launch position.
     * @param {boolean} [throwToRight=false] - Direction of travel.
     */
    constructor(startX, startY, throwToRight = false) {
        super();
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImage(this.IMAGES_ROTATION[0]);

        this.throw(startX, startY, throwToRight);
    }

    /**
     * Overrides {@link MovableObject#isAboveGround} to also return false
     * once the bottle is broken, preventing gravity from running after impact.
     * @returns {boolean}
     */
    isAboveGround() {
        return !this.isBroken && this.y < this.GROUND_Y;
    }

    /**
     * Starts two independent intervals for the in-flight state:
     * - Rotation sprite interval (60 ms)
     * - Horizontal movement interval (25 ms)
     * @returns {void}
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 60);

        this.moveInterval = setInterval(() => {
            this.x += this.speed;
        }, 25);
    }

    /**
     * Initialises position and direction, then starts gravity and animation.
     * Called from the constructor and can be reused to re-throw an instance.
     * @param {number} startX - Horizontal launch position.
     * @param {number} startY - Vertical launch position.
     * @param {boolean} throwToRight - Direction of travel; false flips the sprite.
     * @returns {void}
     */
    throw(startX, startY, throwToRight) {
        this.x = startX;
        this.y = startY;
        this.isBroken = false;
        this.markedForRemoval = false;
        this.otherDirection = !throwToRight;

        this.applyGravity();
        this.animate();
    }

    /**
     * Stops all movement, clears flight intervals, and plays the splash
     * animation frame-by-frame. Sets {@link markedForRemoval} when the
     * splash sequence ends.
     * @returns {void}
     */
    break() {
        if (this.isBroken) return;
        this.isBroken = true;
        this.speed = 0;
        this.speedY = 0;

        if (this.gravityInterval) clearInterval(this.gravityInterval);
        if (this.rotationInterval) clearInterval(this.rotationInterval);
        if (this.moveInterval) clearInterval(this.moveInterval);

        let frame = 0;
        this.splashInterval = setInterval(() => {
            if (frame >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashInterval);
                this.markedForRemoval = true;
                return;
            }
            this.loadImage(this.IMAGES_SPLASH[frame]);
            frame++;
        }, 40);
    }
}

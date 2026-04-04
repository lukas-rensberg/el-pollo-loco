import MovableObject, { GROUND_Y } from "./movable-object.class.js";

export default class Chicken extends MovableObject {
    height = 75
    y = GROUND_Y - this.height
    hitboxX = 0;
    hitboxY = 0;
    width = 75
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ]

    DEAD_IMAGE = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
    ]

    /**
     * Loads the default image, randomizes starting position and speed,
     * then starts animation and movement loops.
     * @constructor
     */
    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.initialize();
        this.speed = this.speed + Math.random() * 0.25;
    }

    /**
     * Preloads sprite sheets, sets a random starting x position within the level,
     * and starts the animation loop.
     * @returns {void}
     */
    initialize() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.DEAD_IMAGE);

        this.x = 300 + Math.random() * 2500;

        this.animate();
    }

    /**
     * Starts two independent intervals:
     * 1. Sprite interval (200 ms) — cycles walking or dead frames.
     * 2. Movement interval (60 FPS) — moves left each tick while alive.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGE);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }

    /**
     * Immediately kills the chicken by zeroing health and speed.
     * The actual removal from the level is deferred by {@link World#removeEnemy}
     * to allow the death animation to complete.
     * @returns {void}
     */
    kill() {
        this.health = 0;
        this.speed = 0;
    }
}

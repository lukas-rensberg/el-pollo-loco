import MovableObject from "./movable-object.class.js";
import SalsaBottle from "./salsa-bottle.class.js";
import { isLongIdle } from '../js/idle-timer.js';

/**
 * The player-controlled character Pepe.
 * Manages movement, jumping, throwing bottles, and all animation states:
 * walking, jumping, hurt, dead, and sleep (triggered after 15 s of user inactivity).
 */
export default class Character extends MovableObject {
    x = 60
    y = 130
    width = 170;
    height = 300;
    hitboxX = 40;
    hitboxY = 100;
    hitboxW = 90;
    hitboxH = 180;
    speed = 10;
    health = 100;
    bottleCount = 0;
    lastThrowTime = 0;
    THROW_COOLDOWN = 100;
    throwKeyPressed = false;
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ]
    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png"
    ]
    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png",
    ]
    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ]
    /** Short-idle / breathing frames, played while standing still. */
    IMAGES_IDLE_SHORT = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ]
    /** Long-idle / sleep frames, played after 15 s of inactivity. */
    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png",
    ]
    world;
    lastFrameAt = 0;

    /** Frame duration in ms per animation state. */
    FRAME_MS = {
        jumping:  80,
        hurt:    100,
        walking: 110,
        sleep:   200,
        idle:    150,
    };

    /**
     * Loads all sprite sheets and starts the physics and animation loops.
     * @constructor
     */
    constructor() {
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_IDLE_SHORT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the animation and game-logic loops.
     * @returns {void}
     */
    animate() {
        this.startAnimationLoop();
        this.startGameLogicLoop();
    }

    /**
     * Starts the 50 ms sprite-selection interval.
     * @returns {void}
     */
    startAnimationLoop() {
        setInterval(() => this.updateAnimationFrame(), 50);
    }

    /**
     * Starts the 60 FPS game-logic interval for movement, throwing, and camera.
     * @returns {void}
     */
    startGameLogicLoop() {
        setInterval(() => {
            this.handleMovement();
            this.handleThrow();
        }, 1000 / 60);
    }

    /**
     * Selects the active sprite strip based on current movement and health state.
     * Falls back to the sleep animation after 15 s of inactivity.
     * @returns {void}
     */
    updateAnimationFrame() {
        const now = Date.now();
        const ms = this.getCurrentFrameMs();
        if (now - this.lastFrameAt < ms) return;
        this.lastFrameAt = now;

        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (!this.isDead() && isLongIdle()) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE_SHORT);
        }
    }

    getCurrentFrameMs() {
        if (this.isAboveGround())  return this.FRAME_MS.jumping;
        if (this.isHurt())         return this.FRAME_MS.hurt;
        if (this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW) return this.FRAME_MS.walking;
        if (!this.isDead() && isLongIdle()) return this.FRAME_MS.sleep;
        return this.FRAME_MS.idle;
    }

    /**
     * Processes movement input and triggers game-over when the character dies.
     * Updates the camera offset after each tick.
     * @returns {void}
     */
    handleMovement() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            this.world.showGameOverScreen();
            return;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
        if (this.world.keyboard.RIGHT_ARROW && this.x < this.world.activeLevel.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
        } else if (this.world.keyboard.LEFT_ARROW && this.x > 60) {
            this.otherDirection = true;
            this.moveLeft();
        }
        this.world.camera_x = -this.x + 60;
    }

    /**
     * Handles throw-key state: resets the pressed flag on release, fires a bottle
     * on a fresh press with inventory available, or discards a bottle thrown backward.
     * @returns {void}
     */
    handleThrow() {
        const isThrowPressed = this.world.keyboard.KEY_D;
        if (!isThrowPressed) {
            this.throwKeyPressed = false;
            return;
        }
        if (this.throwKeyPressed || this.bottleCount <= 0) return;
        this.throwKeyPressed = true;
        if (this.otherDirection) {
            this.bottleCount--;
            this.world.statusBarBottles.setPercentage(this.bottleCount * 20);
        } else {
            this.throw();
        }
    }

    /**
     * Computes the launch position for a thrown bottle based on a facing direction.
     * @param {boolean} throwToRight - True when throwing right.
     * @returns {{x: number, y: number}}
     */
    calculateThrowPosition(throwToRight) {
        return {
            x: throwToRight ? this.x + this.width + 30 : this.x - 60,
            y: this.y + 100
        };
    }

    /**
     * Creates and launches a {@link SalsaBottle} from the character's current position.
     * Enforces {@link THROW_COOLDOWN} between consecutive throws and deducts one bottle.
     * @returns {void}
     */
    throw() {
        const now = new Date().getTime();
        if (now - this.lastThrowTime < this.THROW_COOLDOWN) return;
        this.lastThrowTime = now;

        const throwToRight = !this.otherDirection;
        const pos = this.calculateThrowPosition(throwToRight);
        const bottle = new SalsaBottle(pos.x, pos.y, throwToRight);
        this.world.activeLevel.throwableBottles.push(bottle);
        this.bottleCount--;
        this.world.statusBarBottles.setPercentage(this.bottleCount * 20);
        this.world.playSound("throw");
    }

    /**
     * Returns true when the character's x position exceeds the threshold
     * that triggers the endboss encounter.
     * @returns {boolean}
     */
    isNearBoss() {
        return this.x > 5073;
    }
}

import MovableObject from "./movable-object.class.js";

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

    constructor(startX, startY, throwToRight = false) {
        super();
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImage(this.IMAGES_ROTATION[0]);

        this.throw(startX, startY, throwToRight);
    }

    isAboveGround() {
        return !this.isBroken && this.y < this.GROUND_Y;
    }

    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 60);

        this.moveInterval = setInterval(() => {
            this.x += this.speed;
        }, 25);
    }

    throw(startX, startY, throwToRight) {
        this.x = startX;
        this.y = startY;
        this.isBroken = false;
        this.markedForRemoval = false;
        this.speedY = 30;
        this.speed = throwToRight ? 10 : -10;
        this.otherDirection = !throwToRight;

        this.applyGravity();
        this.animate();
    }

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
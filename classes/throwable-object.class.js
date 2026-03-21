import MovableObject from "./movable-object.class.js";

export default class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];
    THROW_SPEED = 15;
    width = 50;
    height = 50;

    constructor(startX, startY, throwToRight = false) {
        super();
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImage(this.IMAGES_ROTATION[0]);
        
        this.x = startX;
        this.y = startY;
        this.speedY = 0;
        this.otherDirection = false;

        // Horizontal-Geschwindigkeit basierend auf Richtung
        if (throwToRight) {
            this.speed = this.THROW_SPEED;
        } else {
            this.speed = -this.THROW_SPEED;
        }

        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 60);

        setInterval(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }
}
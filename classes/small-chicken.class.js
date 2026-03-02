class SmallChicken extends MovableObject {
    y = 375
    height = 50
    width = 50
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ]

    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.25;

        this.animate()
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 200)

        setInterval(() => {
            this.moveLeft()
        }, 1000 / 60);
    }
}
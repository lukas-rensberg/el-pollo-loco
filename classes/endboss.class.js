class Endboss extends MovableObject {
    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png",
    ]
    height = 350
    width = 300
    y = 100

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING)
        this.x = 719*4 + 600

        this.animate()
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200)

        this.moveLeft()
    }

}
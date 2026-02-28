class Character extends MovableObject {
    x = 60
    y = 130
    width = 170;
    height = 300;
    speed = 10;
    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ]
    world;

    constructor() {
        super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_WALKING);

        this.animate()
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW) {
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imgStore[path];
                this.currentImage++;
            } else {
                this.loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
            }
        }, 50)

        setInterval(() => {
            if (this.world.keyboard.RIGHT_ARROW && this.x < this.world.activeLevel.level_end_x) {
                this.x += this.speed
                this.otherDirection = false;
            } else if (this.world.keyboard.LEFT_ARROW && this.x > 60) {
                this.x -= this.speed
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 60
        }, 1000 / 60)
    }
}
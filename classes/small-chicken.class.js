import Chicken from "./chicken.class.js";
import { GROUND_Y } from "./movable-object.class.js";

export default class SmallChicken extends Chicken {
    height = 50
    y = GROUND_Y - this.height
    width = 50
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ]

    DEAD_IMAGE = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ]

    /**
     * Loads the small chicken's default image and delegates to {@link Chicken#initialize}
     * with the overridden image arrays already in place.
     */
    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.initialize();
    }

    /**
     * Starts two independent intervals identical to {@link Chicken#animate}
     * but using the small chicken sprite strips.
     * @returns {void}
     */
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
    }

    startAnimationLoop() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGE);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    startMovementLoop() {
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }
}

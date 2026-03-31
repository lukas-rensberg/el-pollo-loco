import Chicken from "./chicken.class.js";

/**
 * A smaller, faster variant of {@link Chicken}.
 * Overrides sprite paths and dimensions; behaviour is otherwise identical
 * to the base Chicken class.
 */
export default class SmallChicken extends Chicken {
    y = 375
    height = 50
    width = 50
    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ]

    IMAGES_DEAD = [
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
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }
}

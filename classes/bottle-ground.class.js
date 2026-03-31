import DrawableObject from "./drawable-object.class.js";

/**
 * A salsa bottle lying on the ground that the character can pick up.
 * When collected, {@link World#updateBottles} removes it and increments
 * the character's bottle count.
 */
export default class BottleGround extends DrawableObject {
    x;
    y;
    width = 50;
    height = 80;

    /**
     * Loads the bottle image and places it at the given coordinates.
     * @param {number} [x=100] - Horizontal position within the level.
     * @param {number} [y=350] - Vertical position within the level.
     */
    constructor(x = 100, y = 350) {
        super();
        this.loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
    }
}

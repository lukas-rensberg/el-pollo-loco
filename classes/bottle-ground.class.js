import DrawableObject from "./drawable-object.class.js";

export default class BottleGround extends DrawableObject {
    x;
    y;
    width = 50;
    height = 80;
    hitboxX = 8;
    hitboxY = 10;
    hitboxW = 34;
    hitboxH = 65;

    /**
     * Loads the bottle image and places it at the given coordinates.
     * @constructor
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

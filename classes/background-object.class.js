import MovableObject from "./movable-object.class.js";

export default class BackgroundObject extends MovableObject {
    x = 0
    y = 0
    width = 720;
    height = 480;

    /**
     * Loads the background image and positions the tile at the given x coordinate.
     * @constructor
     * @param {string} imagePath - Path to the background tile image.
     * @param {number} x - Horizontal position of this tile within the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}

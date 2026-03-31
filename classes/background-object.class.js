import MovableObject from "./movable-object.class.js";

/**
 * A static background tile used to compose the scrolling level backdrop.
 * Tiles are 720 × 480 px and are placed side-by-side in {@link Level#backgroundObjects}.
 * The camera translation in {@link World#draw} creates the parallax effect.
 */
export default class BackgroundObject extends MovableObject {
    x = 0
    y = 0
    width = 720;
    height = 480;

    /**
     * Loads the background image and positions the tile at the given x coordinate.
     * @param {string} imagePath - Path to the background tile image.
     * @param {number} x - Horizontal position of this tile within the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}

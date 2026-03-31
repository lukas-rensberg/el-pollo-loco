import MovableObject from "./movable-object.class.js";

/**
 * A decorative cloud sprite that continuously drifts leftward in the background.
 * Provides depth to the parallax scrolling effect.
 */
export default class Cloud extends MovableObject {
    y = 20;
    height = 380;
    width = 650;
    speed = 0.2;

    /**
     * Loads the cloud image, sets its horizontal position, and starts the drift loop.
     * @param {string} imagePath - Path to the cloud image file.
     * @param {number} x - Initial horizontal position within the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    /**
     * Starts an interval that moves the cloud leftward at {@link speed} units per tick.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 25);
    }
}

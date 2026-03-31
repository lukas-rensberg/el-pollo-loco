import MovableObject from "./movable-object.class.js";

/**
 * A collectible coin placed at a random position within the level.
 * When the character's bounding box overlaps a coin, {@link World#updateCoins}
 * removes it and increments the coin status bar.
 */
export default class Coins extends MovableObject {
    y = 350
    height = 100
    width = 100

    /**
     * Loads the coin image and sets a random horizontal position within the level.
     */
    constructor() {
        super();
        this.loadImage("img/8_coin/coin_2.png");
        this.x = 200 + Math.random() * 2000;
    }
}

import ThrowableObject from "./throwable-object.class.js";

/**
 * A salsa bottle used as a throwable weapon by the character.
 * Extends {@link ThrowableObject} without adding new behaviour; the class
 * exists as a named type so collision checks can identify thrown bottles.
 */
export default class SalsaBottle extends ThrowableObject {
    /**
     * Delegates immediately to {@link ThrowableObject} with the given launch parameters.
     * @param {number} [startX=100] - Horizontal launch position.
     * @param {number} [startY=350] - Vertical launch position.
     * @param {boolean} [throwToRight=false] - True to travel right, false to travel left.
     */
    constructor(startX = 100, startY = 350, throwToRight = false) {
        super(startX, startY, throwToRight);
    }
}

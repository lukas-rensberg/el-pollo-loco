/**
 * Shared input-state object passed to both the {@link World} and the
 * {@link Character}.
 * Each property mirrors a physical key or touch button and is toggled
 * by the event listeners in game.js and input.js.
 */
export default class Keyboard {
    /** True while the spacebar (jump) is held. */
    SPACE = false;
    /** True while the left-arrow key or left touch button is held. */
    LEFT_ARROW = false;
    /** True while the right-arrow key or right touch button is held. */
    RIGHT_ARROW = false;
    /** True while the D key or throw touch button is held. */
    KEY_D = false;
}

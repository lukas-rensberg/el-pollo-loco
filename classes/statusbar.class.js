import DrawableObject from "./drawable-object.class.js";

/**
 * A HUD status bar rendered as a pre-drawn image sprite.
 * Three types are supported — health, coins, and bottles — each with six
 * percentage steps (0 / 20 / 40 / 60 / 80 / 100 %).
 * The correct image is resolved by {@link resolveImageIndex} and updated via
 * {@link setPercentage}.
 */
export default class StatusBar extends DrawableObject {
    IMAGES_COINS = [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
    ];

    IMAGES_HEALTH = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png"
    ];

    IMAGES_BOTTLES = [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    percentage = 100;

    /**
     * Preloads all three sprite sets, sets dimensions, and positions the bar
     * vertically based on its type.
     * @param {'health'|'coins'|'bottles'} type - Which status bar to create.
     */
    constructor(type) {
        super();
        this.width = 200;
        this.height = 60;
        this.x = 20;

        this.loadImages(this.IMAGES_HEALTH);
        this.loadImages(this.IMAGES_COINS);
        this.loadImages(this.IMAGES_BOTTLES);

        if (type === 'health') {
            this.y = 0;
            this.IMAGES = this.IMAGES_HEALTH;
        } else if (type === 'coins') {
            this.y = 50;
            this.IMAGES = this.IMAGES_COINS;
        } else if (type === 'bottles') {
            this.y = 100;
            this.IMAGES = this.IMAGES_BOTTLES;
        }

        this.setPercentage(0);
    }

    /**
     * Updates the displayed percentage and swaps to the matching sprite image.
     * @param {number} percentage - New fill level (0–100, in steps of 20).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imgStore[path];
    }

    /**
     * Maps the current {@link percentage} value to a sprite array index (0–5).
     * @returns {number} Index into the active IMAGES array.
     */
    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage > 79) {
            return 4;
        } else if (this.percentage > 59) {
            return 3;
        } else if (this.percentage > 39) {
            return 2;
        } else if (this.percentage > 19) {
            return 1;
        } else {
            return 0;
        }
    }
}

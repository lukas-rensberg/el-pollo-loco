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

    IMAGES_ENDBOSS = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png"
    ];

    percentage = 100;

    /**
     * Preloads all three sprite sets, sets dimensions, and positions the bar
     * vertically based on its type.
     * @param {string} type - Which status bar to create.
     */
    constructor(type) {
        super();
        this.width = 200;
        this.height = 60;
        this.x = 20;

        this.loadImages(this.IMAGES_HEALTH);
        this.loadImages(this.IMAGES_COINS);
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_ENDBOSS);

        this.initialize(type);
        this.setPercentage(0);
    }

    initialize(type) {
        const config = {
            health:  { y: 0,   images: this.IMAGES_HEALTH },
            coins:   { y: 50,  images: this.IMAGES_COINS },
            bottles: { y: 100, images: this.IMAGES_BOTTLES },
            endboss: { y: 0,   images: this.IMAGES_ENDBOSS, x: 500 },
        };
        const { x, y, images } = config[type];
        if (type === "endboss") this.x = x;
        this.y = y;
        this.IMAGES = images;
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
     * Maps the current percentage value to a sprite array index (0–5).
     * Percentage steps are multiples of 20, so dividing by 20 and rounding up
     * yields the correct index directly.
     * @returns {number} Index into the active IMAGES array.
     */
    resolveImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

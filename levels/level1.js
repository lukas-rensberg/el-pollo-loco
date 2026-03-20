import BackgroundObject from "../classes/background-object.class.js";
import Cloud from "../classes/cloud.class.js";
import Chicken from "../classes/chicken.class.js";
import SmallChicken from "../classes/small-chicken.class.js";
import Endboss from "../classes/endboss.class.js";
import Coins from "../classes/coins.class.js";

/**
 * Creates and returns all the game elements for Level 1, including
 * Enemies: An "Endboss", several Chickens, and SmallChickens.
 * Clouds: A series of clouds for the sky.
 * BackgroundObjects: Multiple layers for a parallax scrolling effect.
 * Bottles: Collectible bottle items.
 * Coins: Collectible coin items.
 *
 * @returns {{enemies: Array, clouds: Array, backgroundObjects: Array, coins: Array}} An object containing arrays of all the defined game elements.
 */
export default function createLevel1Objects() {
    let enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
        new Endboss()
    ];
    let clouds = [
        new Cloud("img/5_background/layers/4_clouds/1.png", 0),
        new Cloud("img/5_background/layers/4_clouds/2.png", 650),
        new Cloud("img/5_background/layers/4_clouds/1.png", 1300),
        new Cloud("img/5_background/layers/4_clouds/2.png", 1950),
        new Cloud("img/5_background/layers/4_clouds/1.png", 2600),
        new Cloud("img/5_background/layers/4_clouds/2.png", 3250),
    ];
    let backgroundObjects = [
        new BackgroundObject("img/5_background/layers/air.png", 0),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/air.png", 719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 2),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3),
        new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 719 * 4),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 719 * 4),
    ];
    let coins = [
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
        new Coins(),
    ]

    return { enemies, clouds, backgroundObjects, coins };
}
let enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss()
];
let clouds = [
    new Cloud(),
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


const level1 = new Level(enemies, clouds, backgroundObjects, 719*4+40);
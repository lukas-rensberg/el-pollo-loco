import BackgroundObject from "../classes/background-object.class.js";
import Cloud from "../classes/cloud.class.js";
import Chicken from "../classes/chicken.class.js";
import SmallChicken from "../classes/small-chicken.class.js";
import Endboss from "../classes/endboss.class.js";
import Coins from "../classes/coins.class.js";
import BottleGround from "../classes/bottle-ground.class.js";

const TILE_WIDTH = 719;
const BACKGROUND_TILE_COUNT = 8;
const LEVEL_END_X = TILE_WIDTH * (BACKGROUND_TILE_COUNT - 1) + 40;
const BOSS_SECTION_START_X = LEVEL_END_X - 900;
const SAFE_ENEMY_MAX_X = BOSS_SECTION_START_X - 120;
const BOSS_SPAWN_X = LEVEL_END_X + 500;

function createEnemyAt(EnemyType, x) {
    const enemy = new EnemyType();
    enemy.x = Math.min(x, SAFE_ENEMY_MAX_X);
    return enemy;
}

function createCoinAt(x, y = 350) {
    const coin = new Coins();
    coin.x = x;
    coin.y = y;
    return coin;
}

/**
 * Creates and returns all the game elements for Level 1, including
 * Enemies: An "Endboss", several Chickens, and SmallChickens.
 * Clouds: A series of clouds for the sky.
 * BackgroundObjects: Multiple layers for a parallax scrolling effect.
 * Bottles: Collectible bottle items.
 * Coins: Collectible coin items.
 *
 * @returns {{enemies: Array, clouds: Array, backgroundObjects: Array, coins: Array, bottles: Array, levelEndX: number}} An object containing arrays of all the defined game elements.
 */
export default function createLevel1Objects() {
    const boss = new Endboss();
    boss.x = BOSS_SPAWN_X;

    let enemies = [
        createEnemyAt(Chicken, 500),
        createEnemyAt(Chicken, 900),
        createEnemyAt(SmallChicken, 1200),
        createEnemyAt(Chicken, 1500),
        createEnemyAt(SmallChicken, 1850),
        createEnemyAt(Chicken, 2200),
        createEnemyAt(SmallChicken, 2500),
        createEnemyAt(Chicken, 2850),
        createEnemyAt(SmallChicken, 3150),
        createEnemyAt(Chicken, 3450),
        createEnemyAt(SmallChicken, 3720),
        boss,
    ];

    let clouds = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT + 2; i++) {
        const cloudImage = i % 2 === 0
            ? "img/5_background/layers/4_clouds/1.png"
            : "img/5_background/layers/4_clouds/2.png";
        clouds.push(new Cloud(cloudImage, i * 650));
    }

    let backgroundObjects = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT; i++) {
        const variant = i % 2 === 0 ? "1" : "2";
        const tileX = TILE_WIDTH * i;

        backgroundObjects.push(new BackgroundObject("img/5_background/layers/air.png", tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, tileX));
    }

    let coins = [
        createCoinAt(260, 310),
        createCoinAt(620, 280),
        createCoinAt(980, 320),
        createCoinAt(1380, 280),
        createCoinAt(1780, 320),
        createCoinAt(2180, 280),
        createCoinAt(2580, 320),
        createCoinAt(2980, 280),
        createCoinAt(3380, 320),
        createCoinAt(3780, 280),
    ];

    let bottles = [
        new BottleGround(400, 350),
        new BottleGround(800, 350),
        new BottleGround(1200, 350),
        new BottleGround(1600, 350),
        new BottleGround(2000, 350),
        new BottleGround(2400, 350),
        new BottleGround(2800, 350),
        new BottleGround(3200, 350),
        new BottleGround(3600, 350),
    ];

    return { enemies, clouds, backgroundObjects, coins, bottles, levelEndX: LEVEL_END_X };
}
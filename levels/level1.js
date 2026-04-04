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
const BOSS_SPAWN_X = LEVEL_END_X + 400;
const BOTTLE_GROUND_Y = 350;

/**
 * Creates an enemy of the given type and clamps its x position to a safe zone.
 * @param {Function} EnemyType - Constructor for the enemy class.
 * @param {number} x - Desired x position (clamped to {@link SAFE_ENEMY_MAX_X}).
 * @returns {MovableObject}
 */
function createEnemyAt(EnemyType, x) {
    const enemy = new EnemyType();
    enemy.x = Math.min(x, SAFE_ENEMY_MAX_X);
    return enemy;
}

/**
 * Creates a coin at the given position.
 * @param {number} x - Horizontal position.
 * @param {number} [y=350] - Vertical position.
 * @returns {Coins}
 */
function createCoinAt(x, y = 350) {
    const coin = new Coins();
    coin.x = x;
    coin.y = y;
    return coin;
}

/**
 * Creates and positions the endboss at the end of the level.
 * @returns {Endboss}
 */
function createBoss() {
    const boss = new Endboss();
    boss.x = BOSS_SPAWN_X;
    return boss;
}

/**
 * Creates all enemies for level 1, including regular chickens and the endboss.
 * @returns {MovableObject[]}
 */
function createEnemies() {
    return [
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
        createBoss(),
    ];
}

/**
 * Creates the cloud objects spread across the level width.
 * @returns {Cloud[]}
 */
function createClouds() {
    const clouds = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT + 2; i++) {
        const cloudImage = i % 2 === 0
            ? "img/5_background/layers/4_clouds/1.png"
            : "img/5_background/layers/4_clouds/2.png";
        clouds.push(new Cloud(cloudImage, i * 650));
    }
    return clouds;
}

/**
 * Creates all parallax background layer objects for level 1.
 * @returns {BackgroundObject[]}
 */
function createBackgrounds() {
    const backgroundObjects = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT; i++) {
        const variant = i % 2 === 0 ? "1" : "2";
        const tileX = TILE_WIDTH * i;
        backgroundObjects.push(new BackgroundObject("img/5_background/layers/air.png", tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, tileX));
    }
    return backgroundObjects;
}

/**
 * Creates all collectible coin objects for level 1.
 * @returns {Coins[]}
 */
function createCoins() {
    return [
        createCoinAt(260, 280),
        createCoinAt(620, 230),
        createCoinAt(980, 260),
        createCoinAt(1380, 200),
        createCoinAt(1780, 250),
        createCoinAt(2180, 190),
        createCoinAt(2580, 240),
        createCoinAt(2980, 180),
        createCoinAt(3380, 230),
        createCoinAt(3780, 200),
    ];
}

/**
 * Creates all collectible ground bottle objects for level 1.
 * @returns {BottleGround[]}
 */
function createBottles() {
    return [
        new BottleGround(400, BOTTLE_GROUND_Y),
        new BottleGround(800, BOTTLE_GROUND_Y),
        new BottleGround(1200, BOTTLE_GROUND_Y),
        new BottleGround(1600, BOTTLE_GROUND_Y),
        new BottleGround(2000, BOTTLE_GROUND_Y),
        new BottleGround(2400, BOTTLE_GROUND_Y),
        new BottleGround(2800, BOTTLE_GROUND_Y),
        new BottleGround(3200, BOTTLE_GROUND_Y),
        new BottleGround(3600, BOTTLE_GROUND_Y),
    ];
}

/**
 * Creates and returns all game elements for Level 1.
 * @returns {{enemies: Array, clouds: Array, backgroundObjects: Array, coins: Array, bottles: Array, levelEndX: number}}
 */
export default function createLevel1Objects() {
    return {
        enemies: createEnemies(),
        clouds: createClouds(),
        backgroundObjects: createBackgrounds(),
        coins: createCoins(),
        bottles: createBottles(),
        levelEndX: LEVEL_END_X
    };
}
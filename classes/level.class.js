export default class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    coins = [];
    bottles = [];
    throwableBottles = [];
    level_end_x = 700;

    /**
     * @param {MovableObject[]} enemies - All enemy instances (chickens, endboss).
     * @param {Cloud[]} clouds - Background cloud objects.
     * @param {BackgroundObject[]} backgroundObjects - Parallax background tiles.
     * @param {Coins[]} coins - Collectible coin objects.
     * @param {number} level_end_x - X coordinate that marks the right boundary of the level.
     * @param {BottleGround[]} [bottles=[]] - Collectible bottle objects on the ground.
     */
    constructor(enemies, clouds, backgroundObjects, coins, level_end_x, bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.throwableBottles = [];
        this.level_end_x = level_end_x;
    }
}

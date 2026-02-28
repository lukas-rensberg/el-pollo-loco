class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    level_end_x = 700;

    constructor(enemies, clouds, backgroundObjects, level_end_x) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.level_end_x = level_end_x;
    }
}
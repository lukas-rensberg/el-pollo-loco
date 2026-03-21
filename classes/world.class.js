import Character from "./character.class.js";
import Chicken from "./chicken.class.js";
import Endboss from "./endboss.class.js";
import SmallChicken from "./small-chicken.class.js";
import StatusBar from "./statusbar.class.js";

export default class World {
    character = new Character();
    activeLevel;
    canvas;
    ctx;
    keyboard;
    camera_x;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coins');
    statusBarBottles = new StatusBar('bottles');
    coinPercentage = 0;
    gameOverShown = false;
    animationFrameId = null;
    stopped = false;

    /**
     * Creates the world instance and wires canvas, input state and active level.
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @param {Keyboard} keyboard - Shared keyboard input state.
     * @param {Level} level - Active level with enemies, background objects, clouds and coins.
     */
    constructor(canvas, keyboard, level) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.keyboard = keyboard;
        this.activeLevel = level;
        this.statusBarHealth.setPercentage(this.character.health);
        this.statusBarBottles.setPercentage(0);
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    /**
     * Sets the world reference in character and all enemies to this world instance.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Checks if the Character is colliding with any of the enemies or coins in the active level and reacts accordingly.
     */
    checkCollisions() {
        setInterval(() => {
            this.isCharColliding(this.activeLevel.enemies, (enemy) => {
                if (enemy.isDead() 
                    || this.character.isHurt()
                    || !this.isEnemyHittingCharacter(enemy)
                ) return;

                if (this.isStompingEnemy(enemy)) {
                    enemy.kill();
                    this.character.jump();
                    this.removeEnemy(enemy);
                    return;
                }

                if (!this.isCharacterInAir()) {
                    this.character.hit(20);
                    this.statusBarHealth.setPercentage(this.character.health);
                }
            });

            this.isCharColliding(this.activeLevel.coins, (coin, index) => {
                this.updateCoins(index, 20);
            });

            this.isCharColliding(this.activeLevel.bottles, (bottle, index) => {
                this.updateBottles(index);
            });

            this.checkThrowableBottleCollisions();
        }, 1000 / 60)
    }

    /**
     * Breaks thrown bottles when they hit the ground or the endboss and removes them after splash animation.
     */
    checkThrowableBottleCollisions() {
        for (let i = this.activeLevel.throwableBottles.length - 1; i >= 0; i--) {
            let bottle = this.activeLevel.throwableBottles[i];

            if (bottle.markedForRemoval) {
                this.activeLevel.throwableBottles.splice(i, 1);
                continue;
            }

            if (bottle.isBroken) continue;

            if (this.isBottleHittingGround(bottle) || this.isBottleHittingEndboss(bottle)) {
                bottle.break();
            }
        }
    }

    /**
     * Helper Func:
     * Checks if the thrown bottle is colliding with the ground
     * @param bottle
     * @returns {boolean}
     */
    isBottleHittingGround(bottle) {
        return bottle.speedY <= 0 && bottle.y >= bottle.GROUND_Y;
    }

    /**
     * Helper Func:
     * Checks if the thrown bottle is colliding with the endboss
     * @param bottle
     * @returns {boolean}
     */
    isBottleHittingEndboss(bottle) {
        return this.activeLevel.enemies.some(enemy =>
            enemy instanceof Endboss && bottle.isColliding(enemy));
    }

    /**
     * Updates the coin percentage and removes the collected coin from the level.
     * @param index - The index of the collected coin in the active level's coins array
     * @param amount - The amount of percentage to add to the coin status bar
     */
    updateCoins(index, amount) {
        this.activeLevel.coins.splice(index, 1);
        this.coinPercentage = Math.min(this.coinPercentage + amount, 100);
        this.statusBarCoins.setPercentage(this.coinPercentage);
    }

    /**
     * Updates the bottle count and removes the collected bottle from the level.
     * @param index - The index of the collected bottle in the active level's bottles array
     */
    updateBottles(index) {
        this.activeLevel.bottles.splice(index, 1);
        this.character.bottleCount++;
        this.statusBarBottles.setPercentage(this.character.bottleCount * 20);
    }

    /**
     * Helper function to determine if the character is currently in the air, either by jumping or falling.
     * @returns {boolean}
     */
    isCharacterInAir() {
        return this.character.isAboveGround() || this.character.speedY > 0;
    }

    /**
     * Helper function to determine if the enemy is currently colliding with the character, based on their horizontal positions.
     * @param enemy
     * @returns {boolean}
     */
    isEnemyHittingCharacter(enemy) {
        let characterLeft = this.character.x + 35;
        let characterRight = this.character.x + this.character.width - 35;
        let enemyLeft = enemy.x + 10;
        let enemyRight = enemy.x + enemy.width - 10;

        return characterRight > enemyLeft && characterLeft < enemyRight;
    }

    /**
     * Helper function to determine if the character is stomping the enemy, based on their vertical positions and the character's vertical speed.
     * @param enemy - The enemy to check for stomping collision
     * @returns {boolean}
     */
    isStompingEnemy(enemy) {
        let characterBottom = this.character.y + this.character.height;
        let enemyTopHitZone = enemy.y + Math.max(enemy.height * 0.8, 55);

        return this.character.speedY < 0 &&
            this.isEnemyHittingCharacter(enemy) &&
            characterBottom >= enemy.y &&
            characterBottom <= enemyTopHitZone;
    }

    /**
     * Removes the enemy from the active level after a short delay to allow for death animation to play.
     * @param enemy
     */
    removeEnemy(enemy) {
        setTimeout(() => {
            let idx = this.activeLevel.enemies.indexOf(enemy);
            if (idx > -1) this.activeLevel.enemies.splice(idx, 1);
        }, 2000);
    }

    /**
     * Helper function to check if the character is colliding with any object in the provided array and execute a callback function if a collision is detected.
     * @param array
     * @param callback
     */
    isCharColliding(array, callback) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (this.character.isColliding(array[i])) {
                callback(array[i], i);
            }
        }
    }

    /**
     * Main game loop that
     * - clears the canvas,
     * - translates the context based on the camera position,
     * - draws all game objects and status bars,
     * - and requests the next animation frame.
     */
    draw() {
        if (this.stopped) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0)

        this.addObjectsToMap(this.activeLevel.backgroundObjects)
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addObjectsToMap(this.activeLevel.coins);
        this.addObjectsToMap(this.activeLevel.bottles);
        this.addObjectsToMap(this.activeLevel.throwableBottles);
        this.addToMap(this.character)

        this.ctx.translate(-this.camera_x, 0)

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Adds all objects from the provided array to the map.
     * @param array - The array of objects to add to the map
     */
    addObjectsToMap(array) {
        array.forEach(obj => {
            this.addToMap(obj)
        })
    }

    /**
     * Adds a single object to the map,
     * flipping the image if necessary based on the object's otherDirection property,
     * and drawing the object and its animation frame if applicable.
     * @param obj - The Object to add to the map
     */
    addToMap(obj) {
        if (obj.otherDirection) {
            this.flipImage(obj)
        }

        obj.draw(this.ctx);
        if (obj instanceof Character || obj instanceof Chicken || obj instanceof SmallChicken) {
            obj.drawFrame(this.ctx);
        }

        if (obj.otherDirection) {
            this.flipImageBack(obj);
        }
    }

    /**
     * Helper function to flip the image horizontally by translating
     * and scaling the context, and adjusting the object's x position
     * accordingly.
     * @param obj - The object whose image should be flipped
     */
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    /**
     * Helper function to restore the context to its original state after flipping the image,
     * @param obj - The object whose image should be flipped back to its original orientation
     */
    flipImageBack(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    /**
     * Displays the game over screen by
     * - stopping the game loop,
     * - clearing all intervals,
     * - and showing the game over screen element
     */
    showGameOverScreen() {
        if (this.gameOverShown) return;
        this.gameOverShown = true;
        this.stopped = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
        document.getElementById('gameOverScreen').classList.remove('d-none');
    }
}
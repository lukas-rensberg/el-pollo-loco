import Character from "./character.class.js";
import Endboss from "./endboss.class.js";
import StatusBar from "./statusbar.class.js";
import { GROUND_Y } from "./movable-object.class.js";

export default class World {
    MAX_BOTTLES = 5;
    BOTTLE_PERCENT_STEP = 20;
    character = new Character();
    activeLevel;
    canvas;
    ctx;
    keyboard;
    camera_x;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coins');
    statusBarBottles = new StatusBar('bottles');
    statusBarEndboss = new StatusBar('endboss');
    coinPercentage = 0;
    gameOverShown = false;
    animationFrameId = null;
    stopped = false;
    sounds = null;

    /**
     * Creates the world instance and wires canvas, input state, and active level.
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @param {Keyboard} keyboard - Shared keyboard input state.
     * @param {Level} level - Active level with enemies, background objects, clouds, and coins.
     */
    constructor(canvas, keyboard, level) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.keyboard = keyboard;
        this.activeLevel = level;
        this.statusBarHealth.setPercentage(this.character.health);
        this.statusBarBottles.setPercentage(0);
        this.statusBarEndboss.setPercentage(100);
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    /**
     * Sets the world back-reference on the character and all enemies.
     */
    setWorld() {
        this.character.world = this;
        this.activeLevel.enemies.forEach(enemy => { enemy.world = this; });
    }

    /**
     * Handles a single enemy collision: applies endboss one-shot, stomp kill,
     * or regular damage depending on the situation.
     * @param {Chicken|SmallChicken} enemy - The enemy the character is colliding with.
     * @returns {void}
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.isEnemyHittingCharacter(enemy)) return;
        if (this.character.isHurt() && !(enemy instanceof Endboss)) return;

        if (enemy instanceof Endboss) {

        }

        if (this.isStompingEnemy(enemy)) {
            enemy.kill();
            this.playSound('chickenHit');
            this.character.y = GROUND_Y - this.character.height - 20;
            this.character.jump();
            this.removeEnemy(enemy);
            return;
        }

        if (!this.isCharacterInAir()) {
            this.character.hit(20);
            this.statusBarHealth.setPercentage(this.character.health);
            this.playSound('hurt');
        }
    }

    /**
     * Polls all collision types at 60 FPS and delegates to the appropriate handlers.
     */
    checkCollisions() {
        setInterval(() => {
            this.isCharColliding(this.activeLevel.enemies, (enemy) => this.handleEnemyCollision(enemy));
            this.isCharColliding(this.activeLevel.coins, (coin, index) => this.updateCoins(index, 20));
            this.isCharColliding(this.activeLevel.bottles, (bottle, index) => this.updateBottles(index));
            this.checkThrowableBottleCollisions();
            this.checkIfEndbossDead();
            this.updateWalkingSound();
        }, 1000 / 60);
    }
    /**
     * Checks a single in-flight bottle for ground or enemy collision and reacts.
     * @param {ThrowableObject} bottle - The bottle to check.
     */
    checkBottleImpact(bottle) {
        if (bottle.isBroken) return;
        if (this.isBottleHittingGround(bottle)) {
            bottle.break();
            return;
        }
        const hitEnemy = this.getBottleHitEnemy(bottle);
        if (hitEnemy) this.applyBottleHit(hitEnemy, bottle);
    }

    /**
     * Removes spent bottles, then checks each remaining bottle for impact.
     */
    checkThrowableBottleCollisions() {
        for (let i = this.activeLevel.throwableBottles.length - 1; i >= 0; i--) {
            if (this.activeLevel.throwableBottles[i].markedForRemoval) {
                this.activeLevel.throwableBottles.splice(i, 1);
            }
        }
        this.activeLevel.throwableBottles.forEach(bottle => this.checkBottleImpact(bottle));
    }

    /**
     * Returns the first living enemy whose bounding box overlaps the given bottle,
     * or undefined if no collision is found.
     * @param {ThrowableObject} bottle - The in-flight bottle to test.
     * @returns {Chicken|SmallChicken|Endboss|undefined}
     */
    getBottleHitEnemy(bottle) {
        return this.activeLevel.enemies.find(
            enemy => !enemy.isDead() && bottle.isColliding(enemy)
        );
    }

    /**
     * Breaks the bottle and applies the hit effect based on enemy type:
     * - {@link Endboss}: reduces health by 20 and updates the boss health bar.
     * - Normal enemies: killed instantly and removed after their death animation.
     * @param {Chicken|SmallChicken|Endboss} enemy - The enemy that was hit.
     * @param {ThrowableObject} bottle - The bottle that caused the hit.
     * @returns {void}
     */
    applyBottleHit(enemy, bottle) {
        bottle.break();
        if (enemy instanceof Endboss) {
            enemy.hit(13);
            this.statusBarEndboss.setPercentage(enemy.health);
        } else {
            enemy.kill();
            this.playSound('chickenHit');
            this.removeEnemy(enemy);
        }
    }

    /**
     * Returns true when the bottle has reached or passed ground level.
     * @param {ThrowableObject} bottle
     * @returns {boolean}
     */
    isBottleHittingGround(bottle) {
        return bottle.speedY <= 0 && bottle.y >= bottle.GROUND_Y;
    }

    /**
     * Removes the coin at index and increments the coin percentage bar.
     * @param {number} index - Index in the coins array.
     * @param {number} amount - Percentage points to add (typically 20).
     * @returns {void}
     */
    updateCoins(index, amount) {
        this.activeLevel.coins.splice(index, 1);
        this.coinPercentage = Math.min(this.coinPercentage + amount, 100);
        this.statusBarCoins.setPercentage(this.coinPercentage);
        this.playSound('coin');
    }

    /**
     * Removes the bottle at index and increments the character's bottle inventory.
     * @param {number} index - Index in the bottles array.
     * @returns {void}
     */
    updateBottles(index) {
        if (this.character.bottleCount >= this.MAX_BOTTLES) return;
        this.activeLevel.bottles.splice(index, 1);
        this.character.bottleCount = Math.min(this.character.bottleCount + 1, this.MAX_BOTTLES);
        this.statusBarBottles.setPercentage(this.character.bottleCount * this.BOTTLE_PERCENT_STEP);
        this.playSound('bottle');
    }

    /**
     * Returns true if the character is airborne (jumping or falling).
     * @returns {boolean}
     */
    isCharacterInAir() {
        return this.character.isAboveGround() || this.character.speedY > 0;
    }

    /**
     * Returns true if the enemy's horizontal bounds overlap the character's hit box.
     * @param {MovableObject} enemy - The enemy to test.
     * @returns {boolean}
     */
    isEnemyHittingCharacter(enemy) {
        const charLeft  = this.character.hbLeft;
        const charRight = charLeft + this.character.hbWidth;
        const enemyLeft  = enemy.hbLeft;
        const enemyRight = enemyLeft + enemy.hbWidth;
        return charRight > enemyLeft && charLeft < enemyRight;
    }

    /**
     * Returns true if the character is falling onto the top of the enemy.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isStompingEnemy(enemy) {
        const characterBottom = this.character.hbTop + this.character.hbHeight;
        const enemyTopHitZone = enemy.hbTop + enemy.hbHeight * 0.4;
        return this.character.speedY < 0 &&
            this.isEnemyHittingCharacter(enemy) &&
            characterBottom >= enemy.hbTop &&
            characterBottom <= enemyTopHitZone;
    }

    /**
     * Removes the enemy after a 2 s delay to let the death animation finish.
     * @param {MovableObject} enemy - The enemy to remove.
     * @returns {void}
     */
    removeEnemy(enemy) {
        setTimeout(() => {
            const idx = this.activeLevel.enemies.indexOf(enemy);
            if (idx > -1) this.activeLevel.enemies.splice(idx, 1);
        }, 2000);
    }

    /**
     * Iterates an array backwards and fires callback on each item colliding with the character.
     * @param {Array} array - Array of collidable objects.
     * @param {Function} callback - Called with (item, index) on collision.
     */
    isCharColliding(array, callback) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (this.character.isColliding(array[i])) callback(array[i], i);
        }
    }

    /**
     * Draws all world objects (background, enemies, clouds, collectibles, character)
     * within the camera-translated context.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.activeLevel.backgroundObjects);
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addObjectsToMap(this.activeLevel.coins);
        this.addObjectsToMap(this.activeLevel.bottles);
        this.addObjectsToMap(this.activeLevel.throwableBottles);
        this.addToMap(this.character);
    }

    /**
     * Draws all HUD elements (status bars) in screen space after reversing
     * the camera translation.
     */
    drawHUD() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.hasBeenTriggered) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Main render loop: clears the canvas, draws world objects, draws HUD,
     * then schedules the next frame.
     */
    draw() {
        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawHUD();
        this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Calls {@link addToMap} for each object in the array.
     * @param {Array} array - Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(array) {
        array.forEach(obj => this.addToMap(obj));
    }

    /**
     * Draws a single object, temporarily flipping the canvas context if the
     * object faces left ({@link otherDirection} is true).
     * @param {DrawableObject} obj - The object to draw.
     * @returns {void}
     */
    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        if (obj.otherDirection) this.flipImageBack(obj);
    }

    /**
     * Flips the canvas context horizontally and negates obj.x for correct positioning.
     * @param {DrawableObject} obj - Object to flip.
     * @returns {void}
     */
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    /**
     * Restores the canvas context and negates obj.x back after a flip.
     * @param {DrawableObject} obj - Object to restore.
     * @returns {void}
     */
    flipImageBack(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops the render loop, cancels the animation frame, and clears all intervals.
     */
    stopGameLoop() {
        this.stopped = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    /**
     * Delegates to the global game-over handler if available; otherwise stops
     * the game loop and shows the game-over overlay directly.
     * @returns {void}
     */
    showGameOverScreen() {
        if (this.gameOverShown) return;
        this.gameOverShown = true;
        if (window.showGameOverScreen) {
            window.showGameOverScreen();
            return;
        }
        this.stopGameLoop();
        document.getElementById('gameOverScreen').classList.remove('d-none');
    }

    /**
     * Triggers the win screen if the endboss has been defeated.
     */
    checkIfEndbossDead() {
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.health > 0 || endboss.deathTriggered) return;
        endboss.deathTriggered = true;
        setTimeout(() => { if (window.showWinScreen) window.showWinScreen(); }, 1500);
    }

    /**
     * Plays a short sound effect by name, resetting currentTime for rapid retrigger.
     * @param {string} name - Key in the sounds object (e.g. 'coin', 'bottle', 'throw').
     * @returns {void}
     */
    playSound(name) {
        if (!this.sounds || !this.sounds[name]) return;
        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Starts or stops the walking sound based on character movement and alive state.
     */
    updateWalkingSound() {
        if (!this.sounds || !this.sounds.walking) return;
        const walking = this.sounds.walking;
        const isWalking = !this.character.isDead()
            && !this.character.isAboveGround()
            && (this.keyboard.RIGHT_ARROW || this.keyboard.LEFT_ARROW);

        if (isWalking && walking.paused) {
            walking.play().catch(() => {});
        } else if (!isWalking && !walking.paused) {
            walking.pause();
            walking.currentTime = 0;
        }
    }
}
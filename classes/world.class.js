class World {
    character = new Character();
    activeLevel = level1;
    canvas;
    ctx;
    keyboard;
    camera_x;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coins');
    statusBarBottles = new StatusBar('bottles');

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.keyboard = keyboard;
        this.statusBarHealth.setPercentage(this.character.health);
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.activeLevel.enemies.forEach(enemy => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit(20);
                    this.statusBarHealth.setPercentage(this.character.health);
                    console.log("Enemy is colliding with character", enemy);
                }
            })
        }, 200)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0)

        this.addObjectsToMap(this.activeLevel.backgroundObjects)
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addToMap(this.character)

        this.ctx.translate(-this.camera_x, 0)

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

        requestAnimationFrame(this.draw.bind(this));
    }

    addObjectsToMap(array) {
        array.forEach(obj => {
            this.addToMap(obj)
        })
    }

    addToMap(obj) {
        if (obj.otherDirection) {
            this.flipImage(obj)
        }

        obj.draw(this.ctx);
        if (obj instanceof Character || obj instanceof Chicken) {
            obj.drawFrame(this.ctx);
        }

        if (obj.otherDirection) {
            this.flipImageBack(obj);
        }
    }

    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    flipImageBack(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    showGameOverScreen() {
        //this.stopAnimation()
    }

    stopAnimation() {
        //this.keyboard = null;
        //this.freeze();
    }
}
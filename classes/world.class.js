class World {
    character = new Character();
    activeLevel = level1;
    canvas;
    ctx;
    keyboard;
    camera_x;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.draw()
        this.keyboard = keyboard;
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0)

        this.addObjectsToMap(this.activeLevel.backgroundObjects)
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addToMap(this.character)

        this.ctx.translate(-this.camera_x, 0)

        requestAnimationFrame(this.draw.bind(this));
    }

    addObjectsToMap(array) {
        array.forEach(obj => {
            this.addToMap(obj)
        })
    }

    addToMap(obj) {
        if (obj.otherDirection) {
            this.ctx.save();
            this.ctx.translate(obj.width, 0);
            this.ctx.scale(-1, 1);
            obj.x = obj.x * -1;
        }
        this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height)
        if (obj.otherDirection) {
            obj.x = obj.x * -1;
            this.ctx.restore();
        }
    }

}
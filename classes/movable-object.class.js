class MovableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;
    img;
    currentImage = 0;
    imgStore = {}
    speed = 0.15;
    otherDirection = false;


    moveRight() {
        this.x += 1;
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgStore[path] = img;
        })
    }
}
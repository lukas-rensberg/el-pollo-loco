class DrawableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;
    img;
    currentImage = 0;
    imgStore = {}

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
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

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgStore[path];
        this.currentImage++;
    }
}
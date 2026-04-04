/**
 * @fileOverview Base class for all visual game objects.
 * Handles image loading, image caching in {@link imgStore}, and frame-based animation.
 */
export default class DrawableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;
    img;
    currentImage = 0;
    imgStore = {}

    /**
     * Hitbox offsets relative to the sprite origin.
     * hitboxW / hitboxH default to (width - hitboxX) / (height - hitboxY) when null.
     */
    hitboxX = 0;
    hitboxY = 0;
    hitboxW = null;
    hitboxH = null;

    /** Absolute hitbox left edge in world space. */
    get hbLeft()   { return this.x + this.hitboxX; }
    /** Absolute hitbox top edge in world space. */
    get hbTop()    { return this.y + this.hitboxY; }
    /** Effective hitbox width. */
    get hbWidth()  { return this.hitboxW ?? (this.width  - this.hitboxX); }
    /** Effective hitbox height. */
    get hbHeight() { return this.hitboxH ?? (this.height - this.hitboxY); }

    /**
     * Draws the object's current image onto the canvas at its (x, y) position.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads a single image by path and sets it as the active image.
     * @param {string} path - Path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads an array of image paths into the {@link imgStore} cache so they
     * are available instantly during animation playback.
     * @param {string[]} pathsArray - Array of image file paths to preload.
     * @returns {void}
     */
    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgStore[path] = img;
        });
    }

    /**
     * Advances to the next frame in the given animation strip.
     * Uses {@link currentImage} modulo the strip length so playback loops automatically.
     * @param {string[]} images - Ordered array of image paths forming one animation cycle.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgStore[path];
        this.currentImage++;
    }
}

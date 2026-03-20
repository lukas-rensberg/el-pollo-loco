import MovableObject from "./movable-object.class.js";

export default class Coins extends MovableObject {
    y = 350
    height = 100
    width = 100

    constructor() {
        super();
        this.loadImage("img/8_coin/coin_2.png");
        this.x = 200 + Math.random() * 2000;
    }
}
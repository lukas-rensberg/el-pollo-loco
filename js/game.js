import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    generateWorld()
}

function restartGame() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
    document.getElementById('gameOverScreen').classList.add('d-none');
    keyboard = new Keyboard();
    generateWorld()
}

function generateWorld() {
    canvas = document.getElementById("gameCanvas");
    let levelData = createLevel1Objects();
    let activeLevel = new Level(levelData.enemies, levelData.clouds, levelData.backgroundObjects, levelData.coins, 719 * 4 + 40);
    world = new World(canvas, keyboard, activeLevel);
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case " ":
            keyboard.SPACE = true
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = true;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = true;
            break;
        case "KeyD":
            keyboard.KEY_D = true;
            break;
        default:
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case " ":
            keyboard.SPACE = false
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = false;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = false;
            break;
        case "KeyD":
            keyboard.KEY_D = false;
            break;
        default:
            break;
    }
});

window.startGame = startGame;
window.restartGame = restartGame;
let canvas;
let world;
let keyboard = new Keyboard();

function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    canvas = document.getElementById("gameCanvas");
    world = new World(canvas, keyboard);
}


window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case " ":
            keyboard.SPACE = true
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = true;
            break;
        case "ArrowUp":
            keyboard.UP_ARROW = true;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = true;
            break;
        case "ArrowDown":
            keyboard.DOWN_ARROW = true;
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
        case "ArrowUp":
            keyboard.UP_ARROW = false;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = false;
            break;
        case "ArrowDown":
            keyboard.DOWN_ARROW = false;
            break;
        case "KeyD":
            keyboard.KEY_D = false;
            break;
        default:
            break;
    }
});


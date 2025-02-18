const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 448;
canvas.height = 496;

const tileSize = 32;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isPaused = false;

document.getElementById("highScore").textContent = highScore;

const pacman = {
    x: tileSize,
    y: tileSize,
    radius: 14,
    speed: tileSize / 4,
    direction: "right"
};

const ghosts = [
    { x: 5 * tileSize, y: 5 * tileSize, color: "red", speed: 2 },
    { x: 10 * tileSize, y: 5 * tileSize, color: "pink", speed: 2 }
];

const pellets = [];
for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
        pellets.push({ x: i * tileSize + tileSize / 2, y: j * tileSize + tileSize / 2 });
    }
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") pacman.direction = "up";
    if (event.key === "ArrowDown") pacman.direction = "down";
    if (event.key === "ArrowLeft") pacman.direction = "left";
    if (event.key === "ArrowRight") pacman.direction = "right";
    if (event.key === "p") isPaused = !isPaused; // Pause/Unpause with P
    if (event.key === "r") resetGame(); // Restart with R
});

function drawPacman() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
}

function drawPellets() {
    ctx.fillStyle = "white";
    pellets.forEach((pellet, index) => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, 14, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updatePacman() {
    if (pacman.direction === "right") pacman.x += pacman.speed;
    if (pacman.direction === "left") pacman.x -= pacman.speed;
    if (pacman.direction === "up") pacman.y -= pacman.speed;
    if (pacman.direction === "down") pacman.y += pacman.speed;

    pellets.forEach((pellet, index) => {
        if (Math.hypot(pacman.x - pellet.x, pacman.y - pellet.y) < pacman.radius) {
            pellets.splice(index, 1);
            score += 10;
            document.getElementById("score").textContent = score;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                document.getElementById("highScore").textContent = highScore;
            }
        }
    });
}

function updateGhosts() {
    ghosts.forEach(ghost => {
        const directions = [
            { x: ghost.x + ghost.speed, y: ghost.y },
            { x: ghost.x - ghost.speed, y: ghost.y },
            { x: ghost.x, y: ghost.y + ghost.speed },
            { x: ghost.x, y: ghost.y - ghost.speed }
        ];
        ghost.x = directions[Math.floor(Math.random() * 4)].x;
        ghost.y = directions[Math.floor(Math.random() * 4)].y;
    });
}

function checkCollisions() {
    ghosts.forEach(ghost => {
        if (Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y) < pacman.radius) {
            alert("Game Over!");
            resetGame();
        }
    });

    if (pellets.length === 0) {
        alert("You Win!");
        resetGame();
    }
}

function resetGame() {
    pacman.x = tileSize;
    pacman.y = tileSize;
    pacman.direction = "right";
    score = 0;
    document.getElementById("score").textContent = score;
    pellets.length = 0;

    for (let i = 1; i < cols - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            pellets.push({ x: i * tileSize + tileSize / 2, y: j * tileSize + tileSize / 2 });
        }
    }
}

function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPellets();
        drawPacman();
        drawGhosts();
        updatePacman();
        updateGhosts();
        checkCollisions();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();

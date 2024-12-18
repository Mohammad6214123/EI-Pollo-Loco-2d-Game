const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;

let player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    grounded: false
};

let obstacles = [];
let gameOver = false;

// Event listener for player controls (left, right, jump)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.x -= MOVE_SPEED;
    }
    if (e.key === 'ArrowRight') {
        player.x += MOVE_SPEED;
    }
    if (e.key === ' ' && player.grounded) {
        player.velocityY = JUMP_STRENGTH;
        player.grounded = false;
    }
});

const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', restartGame);

// Function to generate obstacles at random
function generateObstacle() {
    const gap = 200; // Vertical distance between obstacles
    const randY = canvas.height - 100 - Math.floor(Math.random() * gap);
    obstacles.push({ x: canvas.width, y: randY, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT });
}

// Main game loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Prevent player from falling through the ground
    if (player.y + player.height >= canvas.height - 50) {
        player.y = canvas.height - 50 - player.height;
        player.velocityY = 0;
        player.grounded = true;
    }

    // Draw player (El Pollo Loco)
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Update and draw obstacles
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= 5; // Move obstacles leftwards

        // Check for collision
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            gameOver = true;
            document.getElementById('game-over').classList.remove('hidden');
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Remove obstacles that have gone off-screen
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    // Generate new obstacles at random intervals
    if (Math.random() < 0.02) {
        generateObstacle();
    }

    // Loop the game
    requestAnimationFrame(gameLoop);
}

// Restart game
function restartGame() {
    player.x = 100;
    player.y = canvas.height - 150;
    player.velocityY = 0;
    player.grounded = false;
    obstacles = [];
    gameOver = false;
    document.getElementById('game-over').classList.add('hidden');
    gameLoop();
}

// Start the game
gameLoop();

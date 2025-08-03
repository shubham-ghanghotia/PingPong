// Constants
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random()*2 - 1);

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT/2;
  // Clamp paddle within the canvas
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// AI paddle movement (basic)
function moveAI() {
  // Move towards the ball, but clamp speed
  let target = ballY + BALL_SIZE/2 - PADDLE_HEIGHT/2;
  if (aiY < target) {
    aiY += PADDLE_SPEED * 0.7;
    if (aiY > target) aiY = target;
  } else if (aiY > target) {
    aiY -= PADDLE_SPEED * 0.7;
    if (aiY < target) aiY = target;
  }
  // Clamp within canvas
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Ball movement and collision
function moveBall() {
  ballX += ballVelX;
  ballY += ballVelY;

  // Top and bottom wall collision
  if (ballY < 0) {
    ballY = 0;
    ballVelY *= -1;
  }
  if (ballY + BALL_SIZE > canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballVelY *= -1;
  }

  // Paddle collision (player)
  if (
    ballX < PLAYER_X + PADDLE_WIDTH &&
    ballX > PLAYER_X &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballVelX *= -1;
    // Add spin based on where it hit the paddle
    let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
    ballVelY += collidePoint * 0.15;
  }

  // Paddle collision (AI)
  if (
    ballX + BALL_SIZE > AI_X &&
    ballX + BALL_SIZE < AI_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballVelX *= -1;
    // Add spin
    let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
    ballVelY += collidePoint * 0.15;
  }

  // Score
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall(1);
  }
}

// Reset ball after score
function resetBall(direction) {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVelX = BALL_SPEED * direction;
  ballVelY = BALL_SPEED * (Math.random()*2 - 1);
}

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.2;
  for (let y = 0; y < canvas.height; y += 30) {
    ctx.fillRect(canvas.width/2-2, y, 4, 20);
  }
  ctx.globalAlpha = 1;

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Draw scores
  ctx.font = "36px Arial";
  ctx.fillText(playerScore, canvas.width/2-60, 50);
  ctx.fillText(aiScore, canvas.width/2+30, 50);
}

// Main loop
function gameLoop() {
  moveAI();
  moveBall();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
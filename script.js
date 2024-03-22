//algumas mudanças no jogo.
const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let gameLoopInterval;
let score = 2;
let pacManX = canvas.width / 2;
let pacManY = canvas.height / 2;
let gameSpeed = 2; // Velocidade inicial do jogo (em milissegundos)
let level = 1; // Nível inicial do jogo
let levelScoreThreshold = 10; // Pontuação necessária para passar para o próximo nível
let eatAppleSound = new Audio('eat_apple_sound.mp3'); // Efeito sonoro de comer a maçã
let gameOverSound = new Audio('game_over_sound.mp3'); // Efeito sonoro de game over

// Função para limpar o canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Função para desenhar a serpente
function drawSnake() {
    snake.forEach(segment => {
        context.fillStyle = 'green';
        context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// Função para desenhar a maçã
function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

// Função para movimentar a serpente
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) {
        generateNewApple();
        score += 2;
        levelUp(); // Verificar se o jogador avançou de nível
        eatAppleSound.play(); // Reproduzir efeito sonoro
    } else {
        snake.pop();
    }
}

// Função para gerar uma nova maçã
function generateNewApple() {
    apple.x = Math.floor(Math.random() * canvas.width / gridSize);
    apple.y = Math.floor(Math.random() * canvas.height / gridSize);
}

// Função para avançar de nível
function levelUp() {
    if (score >= levelScoreThreshold) {
        level++;
        gameSpeed -= 10; // Aumentar a velocidade do jogo a cada nível
        levelScoreThreshold += 10; // Aumentar a pontuação necessária para o próximo nível
        clearInterval(gameLoopInterval);
        startGame();
    }
}

// Função para atualizar o jogo
function update() {
    clearCanvas();
    drawSnake();
    drawApple();
    moveSnake();
    drawScore();
    if (checkCollision()) {
        gameOver();
    }
}

// Função para desenhar a pontuação
function drawScore() {
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.fillText('Pontuação: ' + score, 10, 30);
    context.fillText('Nível: ' + level, 10, 60);
}

// Função para iniciar o jogo
function startGame() {
    gameLoopInterval = setInterval(update, gameSpeed);
}

// Função para finalizar o jogo
function gameOver() {
    clearInterval(gameLoopInterval); // Pausa o jogo
    gameOverSound.play(); // Reproduzir efeito sonoro de game over
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over! Pressione R para reiniciar', canvas.width / 2, canvas.height / 2);
    document.addEventListener('keydown', handleRestart);
}

// Função para verificar colisão com as bordas do canvas
function checkBoundaryCollision() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize
    );
}

// Função para verificar colisões
function checkCollision() {
    return checkBoundaryCollision() || snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

// Função para atualizar o jogo
function update() {
    clearCanvas();
    if (score > 50 && score <= 100) {
        drawColoredSnake();
    } else if (score > 100) {
        drawPsychedelicRects();
    } else {
        drawSnake();
    }
    drawApple();
    moveSnake(); 
    if (score > 200) {
        drawPacMan();
        chaseSnake();
    }
    drawScore();
    if (checkCollision()) {
        gameOver();
    }
}

// Função para reiniciar o jogo
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    apple = { x: 15, y: 15 };
    score = 0;
    level = 1;
    gameSpeed = 100; // Resetando a velocidade do jogo
    levelScoreThreshold = 10; // Resetando a pontuação necessária para o próximo nível
    clearCanvas();
    startGame();
    document.removeEventListener('keydown', handleRestart);
}

// Função para tratar a reinicialização do jogo
function handleRestart(event) {
    if (event.key === 'r' || event.key === 'R') {
        restartGame();
    }
}

// Adicionando manipuladores de eventos para controlar a direção da serpente
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (event.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (event.key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (event.key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
    }
});

startGame(); // Iniciando o jogo


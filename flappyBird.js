const canvas = document.querySelector('#game__canvas');
const context = canvas.getContext("2d");
const buttonRestart = document.querySelector('#restart__button');
const game__score = document.querySelector('#game__score');

// for blur get container 
const gameContainer = document.querySelector('#container__game');

// get flappy image 
const flappyImage = new Image();
flappyImage.src = 'assets/flappy_dunk.png'

// Game constants 
const FLAP_SPEED = -4; // рух колон вліво

const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

const PIPE_WIDTH = 50; // ширина колони
const PIPE_GAP = 130; // відстань між верхньою і нижньою 

// Bird variables 
let birdX = 50;
let birdY = 220;
let birdVelocity = 0; // швидкість
let birdAcceleration = 0.1; // прискорення 

// helper variables
let bool = false;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// Score and Hide Score 
let scoreDisplay = document.querySelector('#game__score');
let score = 0;
let highScore = 0;

// click keyboard event 
document.body.onkeydown = function(e){
    if(e.code === 'Space'){
        birdVelocity = FLAP_SPEED
        bool = true
    }
}
// button event click 
buttonRestart.addEventListener('click', () => {
    hideEndMenu();
    resetGame();
    loop();
})

function increaseScore(){
   score = score + 1
   game__score.innerHTML = score
}
function checkHitWithPipe(){
    const birdParams = {
        y: birdY, 
        x: birdX,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }
    const pipeTop = {
        y: pipeY - PIPE_GAP, 
        x: pipeX,
        width: PIPE_WIDTH,
        height: pipeY
    }
    const pipeBottom = {
        y: pipeY + PIPE_GAP, 
        x: pipeX,
        width: PIPE_WIDTH,
    }
    if(birdParams.x + birdParams.width + 11 > pipeTop.x && pipeTop.x + pipeTop.width - 11 > birdParams.x
        && pipeTop.height > birdParams.y){
            return true
    }
    if(birdParams.x + birdParams.width + 11 > pipeBottom.x && pipeBottom.x + pipeBottom.width - 11 > birdParams.x
        && pipeBottom.y < birdParams.y + (birdParams.height * 1.67)){
            return true
    }
    if(birdParams.y < 0 || birdParams.y + (birdParams.height * 1.67) >= canvas.height){
        return true
    }
}
function hideEndMenu(){
    document.querySelector('#end__menu').style.display = 'none';
    gameContainer.classList.remove('blur__container');
    score = 0
    game__score.innerHTML = 0
}
function showEndMenu(){
    document.querySelector('#end__menu').style.display = 'flex';
    gameContainer.classList.add('blur__container');

    if(score > highScore){
        highScore = score
    }
    document.querySelector('#best__score').innerHTML = highScore;
    document.querySelector('#end__score').innerHTML = score;
}
function resetGame(){
    pipeX = 400
    pipeY = Math.floor(Math.random() * (350 - 40) + 40)

    birdX = 50;
    birdY = 220;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    bool = false
}
function endGame(){
    showEndMenu()
}
function loop(){
    // clear every loop iteration
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy 
    context.drawImage(flappyImage, birdX, birdY);

    // Draw Pipe 
    context.fillStyle = '#333';
    context.fillRect(pipeX, 0, PIPE_WIDTH, pipeY)
    context.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - (pipeY + PIPE_GAP))

    // pipeY === 300, pipeX === 400 це leftX topY PIPE_WIDTH === 50  PIPE_GAP - відступ між PIPE

    if(checkHitWithPipe()){
        endGame();
        return;
    }
    if(birdX === pipeX){
        increaseScore() 
    }

    if(pipeX < -50){  
        pipeX = 400
        pipeY = Math.floor(Math.random() * (350 - 40) + 40)
    }
    if(bool){
        pipeX -= 2.5
        birdVelocity += birdAcceleration
        birdY += birdVelocity
    }
}

setInterval(loop, 8);
const game = document.querySelector("section");
const Start = document.querySelector(".startGame");
const Restart = document.querySelector(".restartGame");
const gameOver = document.querySelector(".gameOver");
const ball = document.querySelector(".ball");
const paddle = document.querySelector(".paddle");
const displayScore = document.querySelector(".score");
const touch = document.querySelector(".touchWall");
const blockBreak = document.querySelector(".break");
const background = [
  "red",
  "orange",
  "blue",
  "violet",
  "yellow",
  "$00e5ffa1",
  "pink",
];
document.title = "game brick";
let touchStartX = 0;
let paddleStartX = 0;
let paddleX = 130;
let paddleSpeed = 0;
let ballX = 160;
let ballY = 280;
let ballGerakX = 2;
let ballGerakY = 2;
let ballSpeed = 20; //20
let score = 0;
const create = () => {
  for (let c = 0; c < 120; c++) {
    const block = document.createElement("div");
    const random = Math.floor(Math.random() * background.length);
    block.className = "brick";
    block.style.background = background[random];
    block.style.left = (c % 10) * 36.8 + "px";
    block.style.top = Math.floor(c / 10) * 21.5 + "px";
    game.appendChild(block);
  }
};
setInterval(framePaddle, paddleSpeed);
setInterval(frameBall, ballSpeed);
function framePaddle() {
  if (paddleX > game.clientWidth - 100) {
    paddleX = 292;
  }
  if (paddleX < 1) {
    paddleX = 1;
  }
  paddle.style.left = `${paddleX}px`;
}
function frameBall() {
  ballX += ballGerakX;
  ballY += ballGerakY;
  if (ballX < 0 || ballX > game.clientWidth - 10) {
    ballGerakX = -ballGerakX;
    touch.play();
  }
  if (ballY < 0) {
    ballGerakY = -ballGerakY;
    touch.play();
  }
  // if (ballY > game.clientHeight) {

  // }
  if (
    ballY > game.clientHeight - 22 &&
    ballX > paddleX - 1 &&
    ballX < paddleX + 180
  ) {
    ballGerakY = -ballGerakY;
    touch.play();
  }
  const block = document.querySelectorAll(".brick");
  block.forEach((brick) => {
    if (
      ballY < brick.offsetTop + 20 &&
      ballY > brick.offsetTop &&
      ballX > brick.offsetLeft &&
      ballX < brick.offsetLeft + 50
    ) {
      ballGerakY = -ballGerakY;
      brick.style.transfrom = "scale(0.9)";
      blockBreak.play();
      setTimeout(() => {
        brick.remove();
      }, 10);
      score += 10;
      displayScore.innerHTML = `score ${score}`;
    }
  });
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
}
document.addEventListener("mousemove", (e) => {
  paddleX =
    e.clientX - game.getBoundingClientRect().left - paddle.clientWidth / 2;
});

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  paddleStartX = paddle.offsetLeft;
}

function handleTouchMove(e) {
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  paddle.style.left = paddleStartX + deltaX + "px";
  e.preventDefault(); // Prevent page scrolling
}

function handleTouchEnd() {
  // Do something on touch end if needed
}

document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
create();

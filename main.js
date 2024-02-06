const gameStart = document.querySelector(".startGame");
const gameRestart = document.querySelector(".restartGame");
const ball = document.querySelector(".ball");
const game = document.querySelector("section");
const paddle = document.querySelector(".paddle");
const displayScore = document.querySelector(".score");
const touch = document.querySelector(".touchWall");
const blockBreak = document.querySelector(".break");
const gameOver = document.querySelector('.gameOver')
document.title = "game brick";
let paddleX = 140;
let ballGone = 168;
let ballY = 350;
let ballX = 168;
let ballGerakY = 2;
let ballGerakX = 2;
let score = 0;
let kondisiBall = false;
let music = false;
const create = () => {
  for (let c = 0; c < 100; c++) {
    const brick = document.createElement("div");
    brick.className = "brick";
    brick.style.left = (c % 10) * 36.4 + "px";
    brick.style.top = Math.floor(c / 10) * 30 + "px";
    game.appendChild(brick);
  }
};
const updatePaddle = () => {
  if (paddleX < 1) {
    paddleX = 1;
  }
  if (paddleX > 280) {
    paddleX = 280;
  }
  paddle.style.left = paddleX + "px";
  requestAnimationFrame(updatePaddle);
};

const updateBall = () => {
  ballY += ballGerakY;
  ballX += ballGerakX;
  if (ballX < 0 || ballX > 350) {
    ballGerakX = -ballGerakX;
    if (music) {
      music = true;
      touch.src = "/sound/touch.mp3";
    } else if (music == false) {
      music = true;
      touch.src = "";
    }
  }
  if (ballY < 0) {
    ballGerakY = -ballGerakY;
    if (music) {
      music = true;
      touch.src = "/sound/touch.mp3";
    } else if (music == false) {
      music = true;
      touch.src = "";
    }
  }
  if (
    ballY > game.clientHeight - 20 &&
    ballX > paddleX &&
    ballX < paddleX + 80
  ) {
    ballGerakY = -ballGerakY;
    if (ballY > 610 - 20) {
      music = true;
      touch.src = "/sound/touch.mp3";
    } else if (music == false) {
      music = true;
      touch.src = "";
    }
  }
  if (ballY > game.clientHeight -5) {
    ballY = 350
    ballX = 168
    if (ballY < 350) {
      ballY = 350
      ballX = 168
    }
    gameRestart.style.display = "block";
    ball.style.display = "none";
    gameMute();

}
  
  const bricks = document.querySelectorAll(".brick");
  bricks.forEach((brick) => {
    if (
      ballY < brick.offsetTop + 40 &&
      ballY > brick.offsetTop &&
      ballX > brick.offsetLeft &&
      ballX < brick.offsetLeft + 40
    ) {
      ballGerakY = -ballGerakY;
      brick.remove();
      score += 10;
      displayScore.innerHTML = "score" + " " + score;
      blockBreak.src = "/sound/break.mp3";
    }
  });
  ball.style.top = ballY + "px";
  ball.style.left = ballX + "px";

  requestAnimationFrame(updateBall);
  ballGerakX = ballGerakX;
};
const gameMute = () => {
  touch.src = "";
  blockBreak.src = ""; 
};
const restart = () => {
  const bricks = document.querySelectorAll(".brick");
  bricks.forEach((brick) => brick.remove());
  ballY = 350;
  ballX = 168;
  score = 0;
  bricks.forEach((brick) => {
    if (ballY > brick.offsetTop + 10 || ballY < brick.offsetTop + 10) {
      ballY = ballY;
    }
    if (ballY < brick.offsetTop) {
      console.log("lebih");
      console.log(ballY);
      gameRestart.style.display = 'block'
    }
  });
  displayScore.innerHTML = "";
  create();
};
gameStart.addEventListener("click", () => {
  gameStart.style.display = "none";
  updateBall();
  updatePaddle();
});
gameRestart.addEventListener("click", () => {
  gameRestart.style.display = "none";
  ball.style.display = "block";
  gameOver.src = '';
  restart();
});
document.addEventListener("mousemove", (e) => {
  paddleX =
    e.clientX - game.getBoundingClientRect().left - paddle.clientWidth / 2;
});
create();

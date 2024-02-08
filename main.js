const game = document.querySelector("section");
const Start = document.querySelector(".startGame");
const Restart = document.querySelector(".restartGame");
const gameOver = document.querySelector(".gameOver");
const ball = document.querySelector(".ball");
const paddle = document.querySelector(".paddle");
const displayScore = document.querySelector(".score");
const touch = document.querySelector(".touchWall");
const blockBreak = document.querySelector(".break");
const play = document.querySelector(".play")
const changeColor = document.querySelector(".changeColor")
const main = document.querySelector("main")
const lod = document.querySelector('.loading-container')
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
let paddleX = 0;
let paddleGerak = 0;
let ballX = 160;
let ballY = 300;
let ballGerakX = 2;
let ballGerakY = 2;
let ballSpeed = 20; //20
let score = 0;
const createBlocks = () => {
  const backgroundEven = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"]; // Warna latar belakang untuk indeks genap
  const backgroundOdd = ["#87CEFA", "#FF69B4", "#00FA9A", "#FFFF00", "#FF6347"]; // Warna latar belakang untuk indeks ganjil
  
  for (let c = 0; c < 120; c++) {
    const block = document.createElement("div");
    block.className = "brick";
    
    // Memeriksa apakah elemen anak ke-genap atau ganjil
    const isEven = c % 2 === 0;
    
    // Memberikan warna latar belakang yang sesuai berdasarkan indeks genap atau ganjil
    block.style.background = isEven ? backgroundEven[c % backgroundEven.length] : backgroundOdd[c % backgroundOdd.length];
    
    // Mengatur posisi dan ukuran elemen secara tepat
    block.style.left = (c % 10) * 40 + "px"; // Mengatur posisi horizontal dengan unit piksel
    block.style.top = Math.floor(c / 10) * 25 + "px"; // Mengatur posisi vertikal dengan unit piksel
    block.style.width = "36px"; // Mengatur lebar elemen dengan unit piksel
    block.style.height = "20px"; // Mengatur tinggi elemen dengan unit piksel
    
    game.appendChild(block);
  }
};




const paddleMove = (move) => {
  let touch = move.touches[0].clientX;
  // Mengatur batas maksimum posisi paddle agar tidak melewati kanan layar
  if (touch > game.clientWidth - paddle.clientWidth) {
    touch = game.clientWidth - paddle.clientWidth;
  }
  paddleX = touch; // Memperbarui nilai paddleX
  paddle.style.left = touch + 'px';
}


const mouseMove = (event) => {
  const gameRect = game.getBoundingClientRect();
  paddleX = event.clientX - gameRect.left - paddle.clientWidth / 2;
  
  // Mengatur batas maksimum posisi paddle agar tidak melewati kanan game
  const maxPaddleX = gameRect.right - gameRect.left - paddle.clientWidth;
  if (paddleX < 0) {
    paddleX = 0;
  }
  if (paddleX > maxPaddleX) {
    paddleX = maxPaddleX;
  }
  
  paddle.style.left = paddleX + "px";
}
const ballMove = () => {
  ballX += ballGerakX;
  ballY += ballGerakY;
  
  // Deteksi tabrakan dengan dinding kiri dan kanan
  if (ballX < 0 || ballX > game.clientWidth - 20) {
    ballGerakX = -ballGerakX;
    playSound();
  }
  
  // Deteksi tabrakan dengan dinding atas
  if (ballY < 0) {
    ballGerakY = -ballGerakY;
    playSound();
  }
  
  // Deteksi tabrakan dengan paddle
  if (ballY > game.clientHeight - 20 && ballX > paddleX && ballX < paddleX + 80) {
    ballGerakY = -ballGerakY; // Mengubah arah pergerakan hanya jika bola berada di atas paddle
    playSound();
  }
  
  // Deteksi tabrakan dengan dinding bawah (game over)
  if (ballY > game.clientHeight) {
    Start.style.display = "none"
    Restart.style.display = "block"
    console.log("game over");
    playGameOverSound();
    return; // Hentikan permainan setelah deteksi game over
  }

  // Deteksi tabrakan dengan blok
  const blocks = document.querySelectorAll('.brick');
  blocks.forEach(block => {
    if (collision(ball, block)) {
      block.parentNode.removeChild(block); // Menghapus blok dari DOM
      ballGerakY = -ballGerakY; // Mengubah arah pergerakan bola
      playBlockBreakSound();
      score += 10; // Menambah skor
      updateScore(); // Memperbarui tampilan skor
    }
  });

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';
  requestAnimationFrame(ballMove);
}

// Fungsi untuk mendeteksi tabrakan antara dua elemen
function collision(ball, block) {
  const ballRect = ball.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();
  return !(ballRect.right < blockRect.left || 
           ballRect.left > blockRect.right || 
           ballRect.bottom < blockRect.top || 
           ballRect.top > blockRect.bottom);
}

function restartGame() {
  // Reset posisi bola
  ballX = ballX;
  ballY = ballY;
  
  // Reset posisi paddle
  paddleX = paddleX;
  paddle.style.left = paddleX + "px";

  // Reset skor
  score = 0;
  updateScore();

  // Hapus semua blok yang tersisa
  const blocks = document.querySelectorAll('.brick');
  blocks.forEach(block => block.parentNode.removeChild(block));

  // Mulai kembali permainan
  ballMove();
}

Restart.addEventListener("click", restartGame);
// Mendefinisikan variabel audioContext
let audioContext;

// Membuat instance dari AudioContext
try {
  window.AudioContext = window.AudioContext || window.webkitContext;
  audioContext = new AudioContext();
} catch (e) {
  console.error('Web Audio API is not supported in this browser');
}

// Sekarang Anda bisa menggunakan audioContext dalam kode Anda

// Fungsi untuk memperbarui tampilan skor
function updateScore() {
  displayScore.textContent = 'Score: ' + score;
}

// Fungsi untuk memainkan suara
function playSound() {
  // Memeriksa apakah konteks audio ada dan diizinkan untuk pemutaran otomatis
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  touch.play();
}

// Fungsi untuk memainkan suara game over
function playGameOverSound() {
  // Memeriksa apakah konteks audio ada dan diizinkan untuk pemutaran otomatis
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  gameOver.play();
}

// Fungsi untuk memainkan suara saat blok dihancurkan
function playBlockBreakSound() {
  // Memeriksa apakah konteks audio ada dan diizinkan untuk pemutaran otomatis
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  blockBreak.play();
}

// play.addEventListener("click", () => {
//   lod.style.visibility = "visible"
//   play.style.display = "none"
//   changeColor.style.display = "none"
//   setTimeout(() => {
//   lod.style.visibility = "hidden"
//     main.style.display = "flex"
//   game.style.display = "block"
//   },5000)
// })
// const atr = () => {
//   play.style.transform = "translateY(25em)";
//   changeColor.style.transform = "translateY(25em)"
// }
//window.addEventListener("load", atr); 
// Menggunakan window.addEventListener() untuk menangani event saat browser selesai dimuat

document.addEventListener("mousemove", mouseMove)
document.addEventListener("touchmove", paddleMove)
createBlocks()
ballMove()
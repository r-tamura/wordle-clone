const grid = document.getElementById("grid");

const gameHistory = [];
let currentAttempt = "";

const DARKGRAY = "#222";
const GRAY = "#555";
const LIGHTGRAY = "#AAA";
const YELLOW = "#b59f3b";
const GREEN = "#538d4e";

const wordList = [
  "apple",
  "piano",
  "pizza",
  "enter",
  "blitz",
  "smart",
  "table",
  "world",
  "final",
  "clock",
  "earth",
  "small",
  "large",
  "japan",
];

const randomIndex = Math.floor(Math.random() * wordList.length);
const secret = wordList[randomIndex];

let isGameEnd = false;
let isFlipping = false;

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 5; j++) {
      const cell = buildCell();
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

function buildCell() {
  const flipContainer = document.createElement("div");
  flipContainer.classList.add("flip-container");
  flipContainer.classList.add("cell");
  const flipper = document.createElement("div");
  flipper.classList.add("flipper");
  const front = document.createElement("div");
  front.classList.add("front");
  const back = document.createElement("div");
  back.classList.add("back");
  flipContainer.appendChild(flipper);
  flipper.appendChild(front);
  flipper.appendChild(back);
  return flipContainer;
}

function updateGrid() {
  const rows = grid.getElementsByClassName("row");
  for (let i = 0; i < gameHistory.length + 1; i++) {
    const row = rows[i];
    const cells = row.getElementsByClassName("cell");
    const attempt = gameHistory[i] ?? currentAttempt;
    for (let j = 0; j < 5; j++) {
      const cell = cells[j];
      const char = attempt[j] ?? "";
      const [front, back] = cell.querySelectorAll(".front, .back");
      front.textContent = char;
      back.textContent = char;
      front.backgroundColor = DARKGRAY;
      front.style.borderColor = char === "" ? GRAY : LIGHTGRAY;
      back.style.backgroundColor =
        i === gameHistory.length ? DARKGRAY : getColor(attempt, j);
    }
  }
}

function getColor(attempt, index) {
  if (secret[index] === attempt[index]) {
    return GREEN;
  } else if (secret.includes(attempt[index])) {
    return YELLOW;
  }
  return GRAY;
}

function beatCell(i, j) {
  const rows = grid.getElementsByClassName("row");
  const cell = rows[i].getElementsByClassName("cell")[j];
  const keyFrames = [
    { transform: `scale(0.9)` },
    { transform: `scale(1.1)`, offset: 0.5 },
    { transform: `scale(1.0)` },
  ];
  const animationTiming = {
    duration: 200,
  };
  cell.animate(keyFrames, animationTiming);
}

function flipCell(i, j, { delay, duration }) {
  const rows = grid.getElementsByClassName("row");
  const cell = rows[i].getElementsByClassName("cell")[j];
  const flipper = cell.querySelector(".flipper");
  const keyFrames = [
    { transform: `rotateX(0deg)` },
    { transform: `rotateX(180deg)` },
  ];
  const animationTiming = {
    duration,
    delay,
    fill: "forwards",
    easing: "ease-out",
  };
  return flipper.animate(keyFrames, animationTiming);
}

async function flipRow(i, speed = "slow") {
  isFlipping = true;
  if (!["slow", "fast"].includes(speed)) {
    throw Error("speed is required to be 'slow' or 'fast'");
  }
  const animations = [];
  for (let j = 0; j < 5; j++) {
    const animation = flipCell(i, j, {
      duration: speed === "slow" ? 800 : 400,
      delay: j * 300,
    });
    animations.push(animation);
  }
  await Promise.all(animations.map((a) => a.finished));
  isFlipping = false;
}

/**
 * @param {KeyboardEvent} e
 */
function handleKey(e) {
  if (isGameEnd) {
    return;
  }

  if (isFlipping) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    return;
  }

  if (e.repeat) {
    return;
  }

  const prevAttempt = currentAttempt;
  if (/^[a-zA-Z]$/.test(e.key)) {
    if (currentAttempt.length === 5) {
      return;
    }
    const input = e.key.toLowerCase();
    currentAttempt += input;
  } else if (e.key === "Backspace") {
    currentAttempt = currentAttempt.slice(0, -1);
  } else if (e.key === "Enter") {
    if (currentAttempt.length < 5) {
      alert("Not enough letters!");
      return;
    }

    if (!wordList.includes(currentAttempt)) {
      alert("Not in word list");
      return;
    }

    gameHistory.push(currentAttempt);
    currentAttempt = "";

    flipRow(gameHistory.length - 1, "slow").then(() => {
      console.log("finished");
      if (secret === gameHistory.at(-1)) {
        winGame();
        return;
      }

      if (gameHistory.length === 6) {
        loseGame();
        return;
      }
    });
  }
  updateGrid();

  if (prevAttempt < currentAttempt) {
    beatCell(gameHistory.length, currentAttempt.length - 1);
  }
}

function winGame() {
  alert("You won!");
  isGameEnd = true;
}

function loseGame() {
  alert(secret);
  isGameEnd = true;
}

function loadGame() {
  /* Not implemented yet */
}

function saveGame() {
  /* Not implemented yet */
}

buildGrid();
window.addEventListener("keydown", handleKey);

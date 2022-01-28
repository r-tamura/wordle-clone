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

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
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
      cell.textContent = char;
      cell.style.borderColor = char === "" ? GRAY : LIGHTGRAY;
      cell.style.backgroundColor =
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

/**
 * @param {KeyboardEvent} e
 */
function handleKey(e) {
  if (isGameEnd) {
    return;
  }

  const prevAttempt = currentAttempt;
  if (/^[a-zA-Z]$/.test(e.key)) {
    if (currentAttempt.length === 5) {
      return;
    }
    currentAttempt += e.key;
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
  }
  updateGrid();

  if (secret === gameHistory.at(-1)) {
    winGame();
    return;
  }

  if (gameHistory.length === 6) {
    loseGame();
    return;
  }

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

buildGrid();
window.addEventListener("keydown", handleKey);

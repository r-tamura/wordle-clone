const $grid = document.getElementById("grid");
const $keyboard = document.getElementById("keyboard");
const DARKGRAY = "#222";
const GRAY = "#555";
const LIGHTGRAY = "#888";
const YELLOW = "#b59f3b";
const GREEN = "#538d4e";

const GameState = {
  IN_PROGRESS: "IN_PROGRESS",
  WON: "WON",
  LOST: "LOST",
};

let gameHistory = [];
let currentAttempt = "";
let gameState = GameState.IN_PROGRESS;
let pauseGame = false;

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

let randomIndex = Math.floor(Math.random() * wordList.length);
let secret = wordList[randomIndex];

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    const $row = document.createElement("div");
    $row.classList.add("row");
    for (let j = 0; j < 5; j++) {
      const $cell = buildCell();
      $row.appendChild($cell);
    }
    $grid.appendChild($row, "fast");
  }
  updateGrid();
  const animations = gameHistory.map((_, i) => flipRow(i, "fast"));
  Promise.allSettled(animations).then(() => {
    updateKeyboard();
  });
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
  const rows = $grid.getElementsByClassName("row");
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

function buildKeyboard() {
  const rows = ["qwertyuiop", "asdfghjkl", "$Ezxcvbnm$B"];

  for (const row of rows) {
    const $row = document.createElement("div");
    $row.classList.add("row");
    let $key;
    for (let j = 0; j < row.length; j++) {
      let classes = ["key"];
      if (row[j] === "$") {
        j++;
        if (row[j] === "E") {
          $key = document.createElement("div");
          $key.textContent = "Enter";
          classes.push("enter");
        } else if (row[j] === "B") {
          $key = document.createElement("div");
          // TODO: Replace with SVG image
          $key.textContent = "Back";
          classes.push("backspace");
        }
      } else {
        $key = document.createElement("div");
        $key.textContent = row[j];
      }
      $key.classList.add(...classes);
      $row.appendChild($key);
    }
    $keyboard.appendChild($row);
  }
}

function updateKeyboard() {
  const colorMap = new Map();

  for (const attempt of gameHistory) {
    for (let i = 0; i < attempt.length; i++) {
      const char = attempt[i];
      const color = getColor(attempt, i);
      const currentBestColor = colorMap.get(char);
      if (currentAttempt) {
        colorMap.set(char, getBetterColor(color, currentBestColor));
      } else {
        colorMap.set(char, color);
      }
    }
  }

  const $keys = $keyboard.querySelectorAll(".key");
  for (const $key of $keys) {
    const char = $key.textContent;
    const color = colorMap.get(char);
    $key.style.backgroundColor = color ?? LIGHTGRAY;
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

function getBetterColor(c1, c2) {
  const rankMap = {
    [GREEN]: 2,
    [YELLOW]: 1,
    [GRAY]: 0,
  };

  if (rankMap[c1] > rankMap[c2]) {
    return c1;
  }
  if (rankMap[c1] < rankMap[c2]) {
    return c2;
  }
  return c1;
}

function beatCell(i, j) {
  const rows = $grid.getElementsByClassName("row");
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
  const rows = $grid.getElementsByClassName("row");
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
}

/**
 * @param {KeyboardEvent} e
 */
function handleKey(e) {
  if (gameState === GameState.WON || gameState === GameState.LOST) {
    return;
  }

  if (pauseGame) {
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

    if (secret === gameHistory.at(-1)) {
      gameState = GameState.WON;
    } else if (gameHistory.length === 6) {
      gameState - GameState.LOST;
    }
    saveGame();

    pauseGame = true;
    flipRow(gameHistory.length - 1, "slow").then(() => {
      updateKeyboard();
      if (gameState === GameState.WON) {
        winGame();
        return;
      }

      if (gameState === GameState.LOST) {
        loseGame();
        return;
      }
      pauseGame = false;
    });
  }
  updateGrid();

  if (prevAttempt < currentAttempt) {
    beatCell(gameHistory.length, currentAttempt.length - 1);
  }
}

function winGame() {
  alert("You won!");
}

function loseGame() {
  alert(secret);
}

function loadGame() {
  const seriarizedState = window.localStorage.getItem("state");
  if (seriarizedState === null) {
    return;
  }
  const state = JSON.parse(seriarizedState);
  ({ history: gameHistory, secret, gameState } = state);
}

function saveGame() {
  window.localStorage.setItem(
    "state",
    JSON.stringify({ history: gameHistory, secret, gameState })
  );
}

loadGame();
buildGrid();
buildKeyboard();
window.addEventListener("keydown", handleKey);

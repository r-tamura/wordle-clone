const grid = document.getElementById("grid");

const gameHistory = [];
let currentAttempt = "";

const LIGHTGRAY = "#AAA";
const YELLOW = "";
const GREEN = "";

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
    for (let j = 0; j < attempt.length; j++) {
      const cell = cells[j];
      cell.textContent = attempt[j];
      cell.style.borderColor = LIGHTGRAY;
    }
  }
}

/**
 * @param {KeyboardEvent} e
 */
function handleKey(e) {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }

  if (currentAttempt.length === 5) {
    return;
  }

  if (/^[a-z]$/.test(e.key)) {
    currentAttempt += e.key;
  } else if (e.key === "Backspace") {
    currentAttempt = currentAttempt.slice(0, -1);
  }
  updateGrid();
}

buildGrid();
window.addEventListener("keydown", handleKey);

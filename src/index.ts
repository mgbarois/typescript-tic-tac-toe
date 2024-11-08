import "./style.css";

const appElement = document.getElementById("app");
const boardElement = document.getElementById("board");
const ROW_COUNT = 3;
const COL_COUNT = 3;

type Cell = "X" | "O" | "";
type TacTacToeBoard = [
  [Cell, Cell, Cell],
  [Cell, Cell, Cell],
  [Cell, Cell, Cell]
];

let boardState: TacTacToeBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let currentMove: "X" | "O" = "X";
let winner: Cell | "Draw" | "";

function createCell(row: number, col: number, content: Cell = "") {
  const cell = document.createElement("button");
  cell.setAttribute("data-row", row.toString());
  cell.setAttribute("data-col", col.toString());
  cell.setAttribute("data-content", content);
  cell.classList.add("cell");
  cell.addEventListener("click", () => {
    if (winner) return;
    if (content !== "") return;
    boardState[row][col] = currentMove;
    currentMove = currentMove === "X" ? "O" : "X";
    winner = checkBoard();
    renderBoard();
  });
  return cell;
}

type Coordinate = [number, number];
type Victory = [Coordinate, Coordinate, Coordinate];

const victories: Victory[] = [
  // Horizontals
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  // Verticals
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  // Diagonals
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function checkForDraw(): boolean {
  // If all rows are filled, declare a draw
  let isDraw = true;

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      if (boardState[i][j] === "") {
        isDraw = false;
        break;
      }
    }
  }
  return isDraw;
}

function checkBoard(): Cell | "Draw" {
  for (const victory of victories) {
    // const [a, b, c] = victory;
    // const [rowA, colA] = a;
    // const [rowB, colB] = b;
    // const [rowC, colC] = c;
    // if (
    //   boardState[rowA][colA] === boardState[rowB][colB] &&
    //   boardState[rowB][colB] === boardState[rowC][colC] &&
    //   boardState[rowA][colA] !== ""
    // ) {
    //   winner = boardState[rowA][colA];
    //   return winner;
    // }
    const cell1 = boardState[victory[0][0]][victory[0][1]];
    const cell2 = boardState[victory[1][0]][victory[1][1]];
    const cell3 = boardState[victory[2][0]][victory[2][1]];
    if (cell1 === cell2 && cell2 === cell3 && cell1 !== "") {
      return cell1;
    }
  }
  if (checkForDraw()) return "Draw";

  return "";
}

function renderBoard() {
  if (!appElement) throw new Error("Cannot find app");
  if (!boardElement) throw new Error("Cannot find board");
  boardElement.innerHTML = "";
  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, boardState[i][j]));
    }
  }
  const oldMoveElement = document.getElementById("move-element");
  if (oldMoveElement) {
    oldMoveElement.remove();
  }
  const moveElement = document.createElement("p");
  moveElement.id = "move-element";
  moveElement.innerText = winner
    ? `Winner: ${winner}`
    : `Next Move: ${currentMove}`;
  moveElement.classList.add("current-move");
  appElement.insertBefore(moveElement, document.getElementById("reset"));
}

function init() {
  const resetButton = document.getElementById("reset");
  if (!resetButton) throw new Error("No Reset button");
  resetButton.addEventListener("click", () => {
    boardState = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    currentMove = "X";
    winner = "";
    renderBoard();
  });
  renderBoard();
}

init();

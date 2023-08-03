/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let currPlayer = 1; // active player: 1 or 2

const WIDTH = 7;
const HEIGHT = 6;

let board = []; // array of rows, each row is array of cells  (board[y][x])
let restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", restartGame);
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");

  const top = document.createElement("tr");
  top.id = "column-top";
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.id = x;
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.id = `${y}-${x}`;
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = board.length - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const playerPiece = document.createElement("div");
  playerPiece.classList.add("piece");
  playerPiece.classList.add(`piece--player-${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(playerPiece);
}

/** endGame: announce game end */

function endGame() {
  // Add win animation to the winning pieces
  const winPieces = document.querySelectorAll(`.piece--player-${currPlayer}`);
  winPieces.forEach((piece) => {
    piece.classList.add("win");
  });

  // Update the player box with the winning player
  const playerText = document.querySelector(".curr-player");
  playerText.textContent = `Player ${currPlayer} won the game!`;

  // Disable further clicks on the board
  const htmlBoard = document.getElementById("board");
  htmlBoard.removeEventListener("click", handleClick);

  restartBtn.classList.remove("hidden");
}

function restartGame() {
  // Remove all the player pieces from the board
  const cells = document.querySelectorAll("#board td");
  cells.forEach((cell) => {
    cell.innerHTML = "";
  });

  // Reset the board array
  board = [];
  makeBoard();

  // Reset the current player and hide the restart button
  currPlayer = 1;
  restartBtn.classList.add("hidden");

  // Update the player box
  switchPlayer();
}

function switchPlayer() {
  currPlayer = currPlayer === 1 ? 2 : 1;
  let playerText = document.querySelector(".curr-player");
  playerText.querySelector(".curr-player-number").textContent = currPlayer;
  playerText.classList.remove(`player-1`);
  playerText.classList.remove(`player-2`);
  playerText.classList.add(`player-${currPlayer}`);
}

function handleClick(evt) {
  let x = +evt.target.id;
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  board[y][x] = currPlayer;
  placeInTable(y, x);
  if (checkForWin()) {
    return endGame();
  }
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame();
  }
  switchPlayer();
}

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
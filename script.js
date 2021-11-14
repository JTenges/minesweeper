// Logic for minesweeper

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.mine = false;
    this.adjacentMines = 0;
    this.visible = false;
    this.flagged = false;
  }

  reset() {
    this.mine = false;
    this.adjacentMines = 0;
    this.visible = false;
    this.flagged = false;
  }
}

class CellBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.board = [];
    let row;
    for (let x = 0; x < this.width; x++) {
      row = [];
      for (let y = 0; y < this.height; y++) {
        row.push(new Cell(x, y));
      }
      this.board.push(row);
    }
  }

  validPosition(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getCell(x, y) {
    return this.board[x][y];
  }

  *allCells() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        yield this.getCell(x, y);
      }
    }
  }

  [Symbol.iterator]() {
    return this.allCells();
  }

  *adjacentCells(x, y) {
    for (let adjX = x - 1; adjX <= x + 1; adjX++) {
      for (let adjY = y - 1; adjY <= y + 1; adjY++) {
        if (this.validPosition(adjX, adjY)) {
          yield this.getCell(adjX, adjY);
        }
      }
    }
  }

  resize(width, height) {
    //TODO
  }
}

class Minefield {
  constructor() {
    this.cellBoard = new CellBoard(10, 10);
    this.numMines = 20;
    this.numFlagged = 0;
    this.displayNumFlagged = null;

    this.gameState = "IDLE";
  }

  setMines(firstX, firstY) {
    // Create mines
    let i = 0;
    let x;
    let y;
    while (i < this.numMines) {
      x = Math.floor(Math.random() * this.cellBoard.width);
      y = Math.floor(Math.random() * this.cellBoard.height);
      if (
        !(
          x >= firstX - 2 &&
          x <= firstX + 2 &&
          y >= firstY - 2 &&
          y <= firstY + 2
        ) &&
        this.cellBoard.getCell(x, y).mine === false
      ) {
        this.cellBoard.getCell(x, y).mine = true;

        // Increment adjacent cells' mine count
        for (let adjCell of this.cellBoard.adjacentCells(x, y)) {
          adjCell.adjacentMines += 1;
        }

        i++;
      }
    }
  }

  setupGame(x, y) {
    this.gameState = "RUNNING";
    this.setMines(x, y);
  }

  selectCell(x, y) {
    if (this.gameState === "IDLE") {
      this.setupGame(x, y);
    }
    let cell;

    cell = this.cellBoard.getCell(x, y);

    if (cell.flagged === true) {
      return;
    }

    let selected = [cell];

    while (selected.length > 0) {
      cell = selected.pop();

      cell.visible = true;

      // Select adjacent cells if the current one
      // is not adjacent to a mine
      if (cell.adjacentMines === 0) {
        for (let adjCell of this.cellBoard.adjacentCells(cell.x, cell.y)) {
          if (adjCell.visible === false && adjCell.mine === false) {
            selected.push(adjCell);
          }
        }
      }
    }
  }

  toggleFlag(x, y) {
    if (this.gameState === "IDLE") {
      this.setupGame(x, y);
    }

    if (this.cellBoard.validPosition(x, y)) {
      let cell = this.cellBoard.getCell(x, y);

      cell.flagged = !cell.flagged;
      if (cell.flagged === true) {
        this.numFlagged++;
      } else {
        this.numFlagged--;
      }
    }

    if (this.displayNumFlagged !== null) {
      this.displayNumFlagged(this.numFlagged);
    }
  }

  /**
   * Checks for winning or losing game boards
   */
  updateGameState() {
    let win = true;

    for (let cell of this.cellBoard) {
      if (cell.mine === true) {
        if (cell.flagged === false) {
          win = false;
        }
        if (cell.visible === true) {
          this.gameState = "LOST";
          return;
        }
      }
    }

    if (win === true && this.numFlagged === this.numMines) {
      this.gameState = "WIN";
    }
  }

  reset() {
    for (let cell of this.cellBoard) {
      cell.reset();
    }

    this.gameState = "IDLE";
    this.numFlagged = 0;
  }
}

let minefieldDisplay = null;

const minefield = new Minefield();

function updateMinefieldDisplay() {
  let text;
  for (let cell of minefield.cellBoard) {
    text = "";
    if (cell.visible === true) {
      if (cell.mine === true) {
        text = "Mine!";
      } else {
        if (cell.adjacentMines === 0) {
          text = " ";
        } else {
          text = cell.adjacentMines;
        }
        minefieldDisplay[cell.x][cell.y].classList.add("selected");
      }
    } else {
      if (cell.flagged === true) {
        text = " ";
      }
      minefieldDisplay[cell.x][cell.y].classList.remove("selected");
    }
    minefieldDisplay[cell.x][cell.y].textContent = text;

    if (cell.flagged === true && cell.visible === false) {
      let flagIcon = document.createElement("span");
      flagIcon.classList.add("material-icons");
      flagIcon.innerHTML = "flag";
      minefieldDisplay[cell.x][cell.y].appendChild(flagIcon.cloneNode(true));
    }
  }

  minefield.updateGameState();

  if (minefield.gameState === "LOST") {
    alert("LOST");
    minefield.reset();
    updateMinefieldDisplay();
  } else if (minefield.gameState === "WIN") {
    alert("WIN");
    minefield.reset();
    updateMinefieldDisplay();
  }
}

function createMinefieldDisplay() {
  minefieldDisplay = [];

  let board = document.getElementById("board");
  let cell;

  let row;
  let rowDiv;
  // Create cells
  for (let x = 0; x < minefield.cellBoard.width; x++) {
    row = [];
    rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let y = 0; y < minefield.cellBoard.height; y++) {
      cell = document.createElement("button");
      cell.className = "cell";
      cell.onclick = function () {
        minefield.selectCell(x, y);
        updateMinefieldDisplay();
      };
      cell.oncontextmenu = function () {
        minefield.toggleFlag(x, y);
        updateMinefieldDisplay();
        return false;
      };

      // board.appendChild(cell);
      cell.classList.add("col");
      rowDiv.appendChild(cell);

      row.push(cell);
    }
    // board.appendChild(document.createElement("br"));
    board.appendChild(rowDiv);

    minefieldDisplay.push(row);
  }

  // Set flagged count
  const numFlaggedNode = document.getElementById("numFlagged");
  numFlaggedNode.textContent = "0";
  minefield.displayNumFlagged = function (numFlagged) {
    numFlaggedNode.textContent = numFlagged.toString();
  };

  // Set mine count
  const numMinesNode = document.getElementById("numMines");
  numMinesNode.textContent = minefield.numMines;
}

createMinefieldDisplay();

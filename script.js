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
        return  x >= 0 &&
            x < this.width &&
            y >= 0 &&
            y < this.height;
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
        this.cellBoard = new CellBoard(20, 20);

        this.started = false;
    }

    setMines(firstX, firstY, numMines) {
        // Create mines
        let i = 0;
        let x;
        let y;
        while (i < numMines) {
            x = Math.floor(Math.random() * this.cellBoard.width);
            y = Math.floor(Math.random() * this.cellBoard.height);
            if (x !== firstX && y !== firstY) {
                this.cellBoard.getCell(x, y).mine = true;

                // Increment adjacent cells' mine count
                for (const adjCell of this.cellBoard.adjacentCells(x, y)) {
                    adjCell.adjacentMines += 1;
                }

                i++;
            }
        }
    }

    selectCell(x, y) {
        if (this.started === false) {
            this.started = true;
            this.setMines(x, y, 50)
        }

        let selected = [this.cellBoard.getCell(x, y)];

        let cell;
        while (selected.length > 0) {
            cell = selected.pop();

            cell.visible = true;

            // Select adjacent cells if the current one
            // is not adjacent to a mine
            if (cell.adjacentMines === 0) {
                for (const adjCell of this.cellBoard.adjacentCells(cell.x, cell.y)) {
                    if (adjCell.visible === false && adjCell.mine === false) {
                        selected.push(adjCell);
                    }
                }
            }
        }
    }
}

let minefieldDisplay = null;

const minefield = new Minefield();

function updateMinefieldDisplay() {
    let text;
    for (const cell of minefield.cellBoard) {
        if (cell.visible === true) {
            if (cell.mine === true) {
                text = "Mine!";
            } else {
                text = cell.adjacentMines;
            }
            minefieldDisplay[cell.x][cell.y].textContent = text;
        }
    }
}

function createMinefieldDisplay() {
    minefieldDisplay = [];

    let board = document.getElementById("board");
    let cell;

    let row;
    // Create cells
    for (let x = 0; x < minefield.cellBoard.width; x++) {
        row = [];
        for (let y = 0; y < minefield.cellBoard.height; y++) {
            cell = document.createElement("button");
            cell.textContent = "cell";
            cell.className = "cell";
            cell.onclick = function(){
                minefield.selectCell(x, y);
                updateMinefieldDisplay();
            };

            board.appendChild(cell);

            row.push(cell);
        }
        board.appendChild(document.createElement("br"));

        minefieldDisplay.push(row);
    }

}

createMinefieldDisplay();
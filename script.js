// Logic for minesweeper

class Minefield {
    constructor() {
        this.minefield = null;
        this.minefieldView = null;
        this.width = null;
        this.height = null;
    }

    createMinefieldView(width, height) {
        this.minefieldView = [];
        this.width = width;
        this.height = height;

        let row;
        // Create cells
        for (let x = 0; x < width; x++) {
            row = [];
            for (let y = 0; y < height; y++) {
                row.push(false);
            }
            this.minefieldView.push(row);
        }
    }

    validCell(x, y) {
        return  x >= 0 &&
            x < this.minefieldView.length &&
            y >= 0 &&
            y < this.minefieldView[x].length
    }

    /**
     * Takes width and height of the fields as well as the
     * first cell clicked, and number of mines.
     *
     * true cells contain mines
     * a number indicates the number of mines adjacent
     */
    createMinefield(width, height, firstX, firstY, numMines) {
        let row;

        this.minefield = [];

        // Create cells
        for (let x = 0; x < width; x++) {
            row = [];
            for (let y = 0; y < height; y++) {
                row.push(0);
            }
            this.minefield.push(row);
        }

        // Create mines
        let i = 0;
        let x;
        let y;
        while (i < numMines) {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
            if (x !== firstX && y !== firstY) {
                this.minefield[x][y] = true;

                // Increment adjacent cells' mine count
                for (let adjX = x - 1; adjX <= x + 1; adjX++) {
                    for (let adjY = y - 1; adjY <= y + 1; adjY++) {
                        if (this.validCell(adjX, adjY) && this.minefield[adjX][adjY] !== true) {
                            this.minefield[adjX][adjY]++;
                        }
                    }
                }

                i++;
            }
        }
    }

    selectCell(x, y) {
        if (this.minefield === null) {
            this.createMinefield(this.minefieldView.length, this.minefieldView[0].length, x, y, 20);
        }

        let selected = [{"x": x, "y": y}];

        let coords;
        while (selected.length > 0) {
            coords = selected.pop();

            this.minefieldView[coords["x"]][coords["y"]] = true;

            // Select adjacent cells if the current one
            // is not adjacent to a mine
            if (this.minefield[coords["x"]][coords["y"]] === 0) {
                for (let adjX = coords["x"] - 1; adjX <= coords["x"] + 1; adjX++) {
                    for (let adjY = coords["y"] - 1; adjY <= coords["y"] + 1; adjY++) {
                        if (this.validCell(adjX, adjY) &&
                            this.minefieldView[adjX][adjY] === false &&
                            this.minefield[adjX][adjY] !== true) {
                            // console.log({"x": adjX, "y": adjY});
                            selected.push({"x": adjX, "y": adjY});
                        }
                    }
                }
            }
        }
    }
}

let minefieldDisplay = null;

const minefieldBoard = new Minefield();

minefieldBoard.createMinefieldView(10, 10);

function updateMinefieldDisplay() {
    for (let x = 0; x < minefieldBoard.width; x++) {
        for (let y = 0; y < minefieldBoard.height; y++) {
            if (minefieldBoard.minefieldView[x][y] === true) {
                minefieldDisplay[x][y].textContent = minefieldBoard.minefield[x][y];
            }
        }
    }
}

function createMinefieldDisplay() {
    if (minefieldBoard.width === 0) {
        return;
    }
    minefieldDisplay = [];

    let board = document.getElementById("board");
    let cell;

    let row;
    // Create cells
    for (let x = 0; x < minefieldBoard.width; x++) {
        row = [];
        for (let y = 0; y < minefieldBoard.height; y++) {
            cell = document.createElement("button");
            cell.textContent = "cell";
            cell.className = "cell";
            cell.onclick = function(){
                minefieldBoard.selectCell(x, y);
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
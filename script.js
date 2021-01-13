// Logic for minesweeper
let minefield = null;
let minefieldView;

let minefieldDisplay = null;

/**
 * Create a grid representing which cells are visible.
 * 
 * true cells are visible.
 * false cells are not visible.
 */
function createMinefieldView(width, height) {
    minefieldView = [];

    let row;
    // Create cells
    for (let x = 0; x < width; x++) {
        row = [];
        for (let y = 0; y < height; y++) {
            row.push(false);
        }
        minefieldView.push(row);
    }
}

function validCell(x, y) {
    return  x >= 0 &&
            x < minefieldView.length &&
            y >= 0 &&
            y < minefieldView[x].length
}

/**
 * Takes width and height of the fiels as well as the
 * first cell clicked, and number of mines.
 * 
 * true cells contain mines
 * a number indicates the number of mines adjacent
 */
function createMinefield(width, height, firstX, firstY, numMines) {
    let row;

    minefield = [];

    // Create cells
    for (let x = 0; x < width; x++) {
        row = [];
        for (let y = 0; y < height; y++) {
            row.push(0);
        }
        minefield.push(row);
    }

    // Create mines
    let i = 0;
    let x;
    let y;
    while (i < numMines) {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
        if (x !== firstX && y !== firstY) {
            minefield[x][y] = true;
            
            // Increment adjacent cells' mine count
            for (let adjX = x - 1; adjX <= x + 1; adjX++) {
                for (let adjY = y - 1; adjY <= y + 1; adjY++) {
                    if (validCell(adjX, adjY) && minefield[adjX][adjY] !== true) {
                        minefield[adjX][adjY]++;
                    }
                }
            }

            i++;
        }
    }
}

function selectCell(x, y) {
    if (minefield === null) {
        createMinefield(minefieldView.length, minefieldView[0].length, x, y, 20);
    }

    let selected = [{"x": x, "y": y}];

    let coords;
    while (selected.length > 0) {
        coords = selected.pop();

        minefieldView[coords["x"]][coords["y"]] = true;

        // Select adjacent cells if the current one
        // is not adjacent to a mine
        if (minefield[coords["x"]][coords["y"]] === 0) {
            for (let adjX = coords["x"] - 1; adjX <= coords["x"] + 1; adjX++) {
                for (let adjY = coords["y"] - 1; adjY <= coords["y"] + 1; adjY++) {
                    if (validCell(adjX, adjY) &&
                            minefieldView[adjX][adjY] === false &&
                            minefield[adjX][adjY] !== true) {
                        // console.log({"x": adjX, "y": adjY});
                        selected.push({"x": adjX, "y": adjY});
                    }
                }
            }
        }
    }
}

function updateMinefieldDisplay() {
    for (let x = 0; x < minefieldView.length; x++) {
        for (let y = 0; y < minefieldView[x].length; y++) {
            if (minefieldView[x][y] === true) {
                minefieldDisplay[x][y].textContent = minefield[x][y];
            }
        }
    }
}

function createMinefieldDisplay() {
    if (minefieldView.length === 0) {
        return;
    }
    minefieldDisplay = [];

    let board = document.getElementById("board");
    let cell;

    let row;
    // Create cells
    for (let x = 0; x < minefieldView.length; x++) {
        row = [];
        for (let y = 0; y < minefieldView[0].length; y++) {
            cell = document.createElement("button");
            cell.textContent = "cell";
            cell.className = "cell";
            cell.onclick = function(){
                selectCell(x, y);
                updateMinefieldDisplay();
            };

            board.appendChild(cell);

            row.push(cell);
        }
        board.appendChild(document.createElement("br"));

        minefieldDisplay.push(row);
    }

};

createMinefieldView(10, 10);
createMinefieldDisplay();
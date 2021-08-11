import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import Cell from "./components/Cell";
import CellStates from "./model/CellStates";
import CellState from "./model/CellState";

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 20;

const NUM_MINES = 40;

function App() {
  // Create state
  const [board, setBoard] = useState(
    Array(BOARD_HEIGHT * BOARD_WIDTH)
      .fill(CellStates.HIDDEN)
  );

  // Create mines
  const [mineBoard] = useState(makeMines(board, NUM_MINES));

  // Create blank proximity board
  const [proxBoard, setProxBoard] = useState(Array(board.length).fill(null));

  // Select a cell
  const setCellState = (idx: number, cellState: CellState) => {
    const boardCpy = board.slice();
    boardCpy[idx] = cellState;
    setBoard(boardCpy);
  };

  const toggleFlag = (idx: number) => {
    setCellState(idx, board[idx].toggleFlag())
  }

  const revealCell = (idx: number) => {
    // setCellState(idx, board[idx].revealCell());
    const [newBoard, newProxBoard] = selectCell(board, BOARD_WIDTH, mineBoard, proxBoard, idx);
    setBoard(newBoard);
    setProxBoard(newProxBoard);
  }

  // Make board cells
  let rows = [];
  for (let rowIdx = 0; rowIdx < BOARD_HEIGHT; ++rowIdx) {
    let startIdx = rowIdx * BOARD_WIDTH;
    let rowCells = board
      .slice(startIdx, startIdx + BOARD_WIDTH)
      .map((val, idx) => {
        const cellIdx = startIdx + idx;
        return (<Cell
          key={cellIdx}
          cellState={board[cellIdx]}
          handleClick={() => revealCell(cellIdx)}
          handleRightClick={() => toggleFlag(cellIdx)}
          isMined={mineBoard[cellIdx]}
          adjMines={proxBoard[cellIdx]}/>);
      });

    rows.push(
      <div key={rowIdx} className="cell-row">
        {rowCells}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          {rows}
        </div>
      </header>
    </div>
  );
}

// From https://stackoverflow.com/a/2450976
function shuffle(array: number[]) {
  let currentIndex = array.length;
  let randomIndex;

  let shuffled = array.slice();

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

function makeMines(board: CellState[], numMines: number) {
  const numSeq = Array(board.length)
    .fill(null)
    .map((element, index) => index);

  const mineIdxs = shuffle(numSeq)
    .slice(0, numMines);

  const mineBoard = Array(board.length)
    .fill(false);

  mineIdxs.forEach(idx => mineBoard[idx] = true);

  return mineBoard;
}

const getAdjacent = (board: CellState[], boardWidth: number, idx: number) => {
  let adj = [];
  if (idx % boardWidth !== 0) {
    // Not on left edge
    adj.push(idx - boardWidth - 1,
      idx - 1,
      idx + boardWidth - 1);
  }

  if ((idx + 1) % boardWidth !== 0) {
    // Not on right edge
    adj.push(idx - boardWidth + 1,
      idx + 1,
      idx + boardWidth + 1);
  }

  // Directly above and below
  adj.push(idx - boardWidth, idx + boardWidth);

  // Remove indices that are in a row before or after that don't exist
  adj = adj.filter(adjIdx => (adjIdx >= 0 && adjIdx < board.length))

  return adj;
}

function getNumMines(mineBoard: boolean[], idxs: number[]) {
  let mines = 0;
  idxs.forEach(
    (idx) => mineBoard[idx] ? mines += 1: null
  );

  return mines;
}

function selectCell(
    board: CellState[], boardWidth: number, mineBoard: boolean[], proxBoard: number[], idx: number
): [CellState[], number[]] {

  const boardCpy = board.slice();
  const proxBoardCpy = proxBoard.slice();

  let adjMines: number;
  let adjIdxs: number[];
  const cells: number[] = [idx];
  let cellIdx: number = idx;
  let temp: number|undefined;
  while (cells.length > 0) {
    temp = cells.pop();
    if (temp !== undefined) {
      // Should always be the case
      cellIdx = temp;
    }
    boardCpy[cellIdx] = CellStates.REVEALED;

    adjIdxs = getAdjacent(board, boardWidth, cellIdx);
    adjMines = getNumMines(mineBoard, adjIdxs);

    proxBoardCpy[cellIdx] = adjMines;

    if (adjMines === 0) {
      // Select adjacent cells
      for (let adjIdx of adjIdxs) {
        if (boardCpy[adjIdx] !== CellStates.REVEALED && !mineBoard[adjIdx]) {
          cells.push(adjIdx);
        }
      }
    }
  }

  return [boardCpy, proxBoardCpy];
}

export default App;

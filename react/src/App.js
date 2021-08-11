import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import FlagIcon from '@material-ui/icons/Flag';
import {Close} from '@material-ui/icons';

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 20;

const NUM_MINES = 40;

const CellState = {
  HIDDEN: {
    revealCell: () => CellState.REVEALED,
    toggleFlag: () => CellState.FLAGGED
  },
  REVEALED: {
    revealCell: () => CellState.REVEALED,
    toggleFlag: () => CellState.REVEALED
  },
  FLAGGED: {
    revealCell: () => CellState.FLAGGED,
    toggleFlag: () => CellState.HIDDEN
  }
}

function Cell(props) {
  let className = "Cell";
  let content = null;

  switch (props.cellState) {
    case CellState.REVEALED:
      className += " Cell-revealed";
      if (props.isMined) {
        content = <Close/>
      } else if (props.adjMines !== null && props.adjMines > 0) {
        content = props.adjMines;
      }
      break;
    case CellState.FLAGGED:
      content = <FlagIcon/>;
      break;
    default:
      // do nothing
  }

  const handleContextMenu = event => {
    event.preventDefault();
    props.handleRightClick();
  }

  return (<button
    className={className}
    onClick={props.handleClick}
    onContextMenu={handleContextMenu}>
    {content}
  </button>);
}

function App() {
  // Create state
  const [board, setBoard] = useState(
    Array(BOARD_HEIGHT * BOARD_WIDTH)
      .fill(CellState.HIDDEN)
  );

  // Create mines
  const [mineBoard] = useState(makeMines(board, NUM_MINES));

  // Create blank proximity board
  const [proxBoard, setProxBoard] = useState(Array(board.length).fill(null));

  // Select a cell
  const setCellState = (idx, cellState, callback) => {
    const boardCpy = board.slice();
    boardCpy[idx] = cellState;
    setBoard(boardCpy, callback);
  };

  const toggleFlag = (idx) => {
    setCellState(idx, board[idx].toggleFlag())
  }

  const revealCell = (idx) => {
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
function shuffle(array) {
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

function makeMines(board, numMines) {
  const numSeq = Array(board.length)
    .fill()
    .map((element, index) => index);

  const mineIdxs = shuffle(numSeq)
    .slice(0, numMines);

  const mineBoard = Array(board.length)
    .fill(false);

  mineIdxs.forEach(idx => mineBoard[idx] = true);

  return mineBoard;
}

const getAdjacent = (board, boardWidth, idx) => {
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

function getNumMines(mineBoard: Array<boolean>, idxs: Array<Number>) {
  let mines = 0;
  idxs.forEach(
    (idx) => (mineBoard[idx] === true) ? mines += 1: null
  );

  return mines;
}

function selectCell(board, boardWidth, mineBoard, proxBoard, idx) {
  const boardCpy = board.slice();
  const proxBoardCpy = proxBoard.slice();

  let cellIdx;
  let adjMines;
  let adjIdxs;
  const cells = [idx];
  while (cells.length > 0) {
    cellIdx = cells.pop();
    boardCpy[cellIdx] = CellState.REVEALED;

    adjIdxs = getAdjacent(board, boardWidth, cellIdx);
    adjMines = getNumMines(mineBoard, adjIdxs);

    proxBoardCpy[cellIdx] = adjMines;

    if (adjMines === 0) {
      // Select adjacent cells
      for (let adjIdx of adjIdxs) {
        if (boardCpy[adjIdx] !== CellState.REVEALED && mineBoard[adjIdx] === false) {
          cells.push(adjIdx);
        }
      }
    }
  }

  return [boardCpy, proxBoardCpy];
}

export default App;

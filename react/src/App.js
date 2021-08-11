import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import FlagIcon from '@material-ui/icons/Flag';
import {Close} from '@material-ui/icons';

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
  const BOARD_HEIGHT = 10;
  const BOARD_WIDTH = 10;

  const NUM_MINES = 20;

  // Create state
  const [board, setBoard] = useState(
    Array(BOARD_HEIGHT * BOARD_WIDTH)
      .fill(CellState.HIDDEN)
  );

  // Create mines
  const [mineBoard] = useState(makeMines(board, NUM_MINES));

  // Select a cell
  const setCellState = (idx, cellState) => {
    const boardCpy = board.slice();
    boardCpy[idx] = cellState;
    setBoard(boardCpy);
  };

  const toggleFlag = (idx) => {
    setCellState(idx, board[idx].toggleFlag())
  }

  const revealCell = (idx) => {
    setCellState(idx, board[idx].revealCell())
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
          isMined={mineBoard[cellIdx]}/>);
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

export default App;

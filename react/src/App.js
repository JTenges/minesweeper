import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Cell(props) {
  let className = "Cell";
  if (props.isRevealed) {
    className += " Cell-revealed";
  }
  return <button className={className} onClick={props.handleClick} />;
}

function App() {
  const BOARD_HEIGHT = 10;
  const BOARD_WIDTH = 10;
  // Create state
  const [board, setBoard] = useState(Array(BOARD_HEIGHT * BOARD_WIDTH).fill(false));

  // Select a cell
  const revealCell = (idx) => {
    const boardCpy = board.slice();
    boardCpy[idx] = true;
    setBoard(boardCpy);
  };

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
          isRevealed={board[cellIdx]}
          handleClick={() => revealCell(cellIdx)}/>);
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

export default App;

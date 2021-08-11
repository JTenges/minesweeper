import logo from './logo.svg';
import './App.css';

function App() {
  const BOARD_HEIGHT = 10;
  const BOARD_WIDTH = 10;

  // Make board cells
  let board = Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null);
  let rows = [];
  for (let rowIdx = 0; rowIdx < BOARD_HEIGHT; ++rowIdx) {
    let startIdx = rowIdx * BOARD_WIDTH;
    let rowCells = board
      .slice(startIdx, startIdx + BOARD_WIDTH)
      .map((val, idx) => <button className="cell" key={idx}/>);

    rows.push(
      <div className="cell-row">
        {rowCells}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {rows}
        </p>
      </header>
    </div>
  );
}

export default App;

interface CellState {
    revealCell: () => CellState,
    toggleFlag: () => CellState
}

export default CellState;

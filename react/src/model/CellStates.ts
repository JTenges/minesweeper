import CellState from "./CellState";

const HIDDEN: CellState = {
    revealCell: () => REVEALED,
    toggleFlag: () => FLAGGED
};

const REVEALED: CellState = {
    revealCell: () => REVEALED,
    toggleFlag: () => REVEALED
};

const FLAGGED: CellState = {
    revealCell: () => FLAGGED,
        toggleFlag: () => HIDDEN
}

const CellStates = {
    HIDDEN: HIDDEN,
    REVEALED: REVEALED,
    FLAGGED: FLAGGED
}

export default CellStates;

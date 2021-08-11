import {Close} from "@material-ui/icons";
import FlagIcon from "@material-ui/icons/Flag";
import CellStates from "../model/CellStates";
import React from "react";
import CellState from "../model/CellState";

function Cell(props: CellProps) {
    let className = "Cell";
    let content = null;

    switch (props.cellState) {
        case CellStates.REVEALED:
            className += " Cell-revealed";
            if (props.isMined) {
                content = <Close/>
            } else if (props.adjMines !== null && props.adjMines > 0) {
                content = props.adjMines;
            }
            break;
        case CellStates.FLAGGED:
            content = <FlagIcon/>;
            break;
        default:
        // do nothing
    }

    const handleContextMenu: React.MouseEventHandler = event => {
        event.preventDefault();
        props.handleRightClick(event);
    }

    return (<button
        className={className}
        onClick={props.handleClick}
        onContextMenu={handleContextMenu}>
        {content}
    </button>);
}

interface CellProps {
    cellState: CellState,
    isMined: boolean,
    adjMines: number,
    handleRightClick: React.MouseEventHandler,
    handleClick: React.MouseEventHandler
}

export default Cell;

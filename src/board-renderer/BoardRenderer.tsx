import { convert2dGridIndicesTo1dIndex } from "../common/board_utilities";
import { wrapCssClassNameWithPrefix } from "../common/string_utils";
import "./BoardRenderer.css";

/** Structure of a tetris board definition that the board renderer can read. */
export interface TetrisBoard {
  board: boolean[][];
}

const boardRendererCssPrefix = "board-renderer";

/** Component that renders the given grid-defined tetris board. */
export default function BoardRenderer({ board }: TetrisBoard) {
  const numBoardCols = board[0].length ?? 0;
  const numBoardRows = board.length ?? 0;

  const gridCells: JSX.Element[] = [];

  for (let r = 0; r < numBoardRows; r++) {
    for (let c = 0; c < numBoardCols; c++) {
      const cellIndex = convert2dGridIndicesTo1dIndex(r, c, {
        numRows: numBoardRows,
        numCols: numBoardCols,
      });
      if (board[r][c]) {
        gridCells[cellIndex] = getFilledGridCell(cellIndex);
      } else {
        gridCells[cellIndex] = getUnfilledGridCell(cellIndex);
      }
    }
  }

  return (
    <div className={wrapCssClassNameWithPrefix("grid", boardRendererCssPrefix)}>
      {gridCells}
    </div>
  );
}

function getUnfilledGridCell(id: number) {
  return <div key={id} className={getBaseGridCellClassName()} />;
}

function getFilledGridCell(id: number) {
  const filledCellClass = `${getBaseGridCellClassName()} filled`;
  return <div key={id} className={filledCellClass} />;
}

function getBaseGridCellClassName() {
  return wrapCssClassNameWithPrefix("grid-cell", boardRendererCssPrefix);
}

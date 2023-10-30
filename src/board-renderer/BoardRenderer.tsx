import { wrapCssClassNameWithPrefix } from "../common/string_utils";
import "./BoardRenderer.css";

/** Structure of a tetris board definition that the board renderer can read. */
export interface TetrisBoard {
  // TODO: change to allow rendering of different colours? Colour enum?
  board: boolean[][];
}

const boardRendererCssPrefix = "board-renderer";

/** Component that renders the given grid-defined tetris board. */
export default function BoardRenderer({ board }: TetrisBoard) {
  // TODO: introducing caching of these so we don't regenerate the entire board all the time.
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

function convert2dGridIndicesTo1dIndex(
  rowIndex: number,
  colIndex: number,
  gridDims: { numRows: number; numCols: number }
): number {
  const { numRows, numCols } = gridDims;
  if (rowIndex < 0) throw new Error("Negative row index!");
  if (colIndex < 0) throw new Error("Negative col index!");
  if (rowIndex + 1 > numRows)
    throw new Error("Row index exceeded num of rows!");
  if (colIndex + 1 > numCols)
    throw new Error("Row index exceeded num of rows!");

  return rowIndex * numCols + colIndex;
}

// TODO: class names to accommodate colours??
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

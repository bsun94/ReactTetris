/**
 * Converts 2D coords of a grid into an index of an array of
 * the flattened grid.
 */
export function convert2dGridIndicesTo1dIndex(
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

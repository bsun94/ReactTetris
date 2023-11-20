/**
 * Returns an array of arrays filled with false to represent
 * a Tetris board area.
 */
export function getPlayingBoard(width = 9, depth = 15) {
  const board: boolean[][] = [];
  for (let i = 0; i < depth; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < width; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
}

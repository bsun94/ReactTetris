// CSS styling for board currently based on this many blocks;
// do not change unless we've figured out a more dynamic way to style in CSS
// TODO: consider https://stackoverflow.com/questions/52005083/how-to-define-css-variables-in-style-attribute-in-react-and-typescript
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

/**
 * Coordinates represents intervals (i.e. filled-in blocks) vs. points (which would only be the
 * corners of blocks)
 */
export interface TetrisPiece {
  /**
   * Coordinates of each of the blocks comprising the piece's body relative to an "origin" block
   * (implied [0, 0]) that should be the top-left corner of the piece's bounding box.
   *
   * Note that these are array index coords, not Cartesian coords i.e. as x > 0, moving to right of
   * board; as y > 0, moving *down* the board.
   */
  pieceBody: Coordinates[];
}

/** Tuple of 2 numbers representing the coords of a tetris piece's blocks. */
export type Coordinates = [number, number];

/** @VisibleForTesting */
export const SQUARE: TetrisPiece = {
  pieceBody: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
};
const LINE: TetrisPiece = {
  pieceBody: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
};
/** @VisibleForTesting */
export const L_SHAPE: TetrisPiece = {
  pieceBody: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
  ],
};
const Z_SHAPE: TetrisPiece = {
  pieceBody: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
};
const T_SHAPE: TetrisPiece = {
  pieceBody: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 0],
  ],
};

/** Currently available pieces to use in Tetris. */
export const AVAILABLE_PIECES = Object.freeze([
  SQUARE,
  LINE,
  L_SHAPE,
  Z_SHAPE,
  T_SHAPE,
]);

/** Randomly (uniform distribution) returns an available piece. */
export function getRandomPiece(): TetrisPiece {
  const index = Math.floor(Math.random() * AVAILABLE_PIECES.length);
  return AVAILABLE_PIECES[index];
}

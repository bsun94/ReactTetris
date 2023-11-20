import {
  Coordinates,
  getRandomPiece,
  TetrisPiece,
} from "../common/available_pieces";
import { TetrisBoard } from "../board-renderer/BoardRenderer";

/**
 * A component that provides services in managing the tetris piece the user is currently in control
 * of.
 */
export interface PieceManager {
  /** Creates the new Tetris piece that the piece manager will now work with. */
  createNewPiece: (anchorPoint: Coordinates, board: TetrisBoard) => ActivePiece;

  /** Returns null to indicate that the rotation is an illegal move. */
  rotateLeft: (piece: ActivePiece, board: TetrisBoard) => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  rotateRight: (piece: ActivePiece, board: TetrisBoard) => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  flipHorizontally: (
    piece: ActivePiece,
    board: TetrisBoard
  ) => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  moveLeft: (piece: ActivePiece, board: TetrisBoard) => ActivePiece | null;

  /** Returns null to indicate that the rotation is an illegal move. */
  moveRight: (piece: ActivePiece, board: TetrisBoard) => ActivePiece | null;

  /**
   * Represents a normal one-tick drop of a piece in the board. A null returned
   * represents the end of the current piece's lifespan.
   */
  tickDrop: (piece: ActivePiece, board: TetrisBoard) => ActivePiece | null;
}

/**
 * Object representing the tetris piece the user is currently controlling.
 */
export interface ActivePiece extends TetrisPiece {
  /**
   * Coords of the anchor point of Tetris piece. This is always the top-left
   * corner of the piece's bounding box in this app within the Tetris board.
   */
  anchorPoint: Coordinates;
}

interface PieceBoundingBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/** Enumeration of potential errors thrown by a PieceManager. */
export enum PieceManagerErrors {
  ON_INIT_ACTIVE_PIECE_OUT_OF_BOUNDS = "Active piece is out of board bounds right upon init!",
  ON_INIT_ACTIVE_PIECE_COLLIDES_WITH_EXISTING_PARTICLES = "Active piece collides with existing particles right upon init!",
}

/**
 * Component that provides support in managing the active piece falling down on
 * the board.
 */
export default class DefaultPieceManager implements PieceManager {
  createNewPiece(anchorPoint: Coordinates, board: TetrisBoard): ActivePiece {
    const { pieceBody } = getRandomPiece();
    const potentialNewPiece = { anchorPoint, pieceBody };
    const isPieceWithinBoard = this.isPieceWithinBoardBounds(
      potentialNewPiece,
      board
    );
    if (!isPieceWithinBoard) {
      throw new Error(PieceManagerErrors.ON_INIT_ACTIVE_PIECE_OUT_OF_BOUNDS);
    }
    const doesPieceCollideWithExisting =
      this.doesPieceCollideWithExistingParticles(potentialNewPiece, board);
    if (doesPieceCollideWithExisting) {
      throw new Error(
        PieceManagerErrors.ON_INIT_ACTIVE_PIECE_COLLIDES_WITH_EXISTING_PARTICLES
      );
    }
    return potentialNewPiece;
  }

  moveLeft(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x - 1, y];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  moveRight(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x + 1, y];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  tickDrop(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const [x, y] = anchorPoint;
    const newAnchor: [number, number] = [x, y + 1];
    const potentialNewPiece = { anchorPoint: newAnchor, pieceBody };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  rotateLeft(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const transformedBodyBlocks = this.invertCoords(
      this.reflectAlongXAxis(pieceBody)
    );
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  rotateRight(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const transformedBodyBlocks = this.reflectAlongXAxis(
      this.invertCoords(pieceBody)
    );
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  flipHorizontally(piece: ActivePiece, board: TetrisBoard): ActivePiece | null {
    const { anchorPoint, pieceBody } = piece;
    const transformedBodyBlocks = this.reflectAlongYAxis(pieceBody);
    const potentialNewPiece = { anchorPoint, pieceBody: transformedBodyBlocks };
    return this.returnPieceIfAllowed(potentialNewPiece, board);
  }

  private returnPieceIfAllowed(
    piece: ActivePiece,
    board: TetrisBoard
  ): ActivePiece | null {
    const isPieceAllowed = this.isPieceinAllowedState(piece, board);
    if (isPieceAllowed) {
      return piece;
    }
    return null;
  }

  private isPieceinAllowedState(
    piece: ActivePiece,
    board: TetrisBoard
  ): boolean {
    const withinBoard = this.isPieceWithinBoardBounds(piece, board);
    if (!withinBoard) return false;
    const collidesWithExistingParticles =
      this.doesPieceCollideWithExistingParticles(piece, board);
    if (collidesWithExistingParticles) return false;
    return true;
  }

  private isPieceWithinBoardBounds(
    piece: ActivePiece,
    board: TetrisBoard
  ): boolean {
    const pieceBounds = this.getBoundingBoxForPiece(piece);
    const boardRightBound = board.board[0].length;
    const boardBottomBound = board.board.length;
    if (
      pieceBounds.left < 0 ||
      pieceBounds.right >= boardRightBound ||
      pieceBounds.bottom >= boardBottomBound
    ) {
      return false;
    }
    return true;
  }

  private getBoundingBoxForPiece(piece: ActivePiece): PieceBoundingBox {
    const { anchorPoint, pieceBody } = piece;
    const [anchorX, anchorY] = anchorPoint;
    let top = 0,
      bottom = 0,
      left = 0,
      right = 0;
    for (const [x, y] of pieceBody) {
      if (x < 0) {
        throw new Error(
          `Relative coord found in current active piece's body with a component block that is left of the anchor point! Block coords x=${x}, y=${y} (x should never be negative)`
        );
      }
      if (y < 0) {
        throw new Error(
          `Relative coord found in current active piece's body with a component block that is higher than the anchor point! Block coords x=${x}, y=${y} (y should never be smaller than 0)`
        );
      }

      top = Math.min(y, top);
      bottom = Math.max(y, bottom);
      left = Math.min(x, left);
      right = Math.max(x, right);
    }

    return {
      top: top + anchorY,
      bottom: bottom + anchorY,
      left: left + anchorX,
      right: right + anchorX,
    };
  }

  private doesPieceCollideWithExistingParticles(
    piece: ActivePiece,
    board: TetrisBoard
  ): boolean {
    const { anchorPoint, pieceBody } = piece;
    const [anchorX, anchorY] = anchorPoint;
    for (const [blockX, blockY] of pieceBody) {
      const finalX = anchorX + blockX;
      const finalY = anchorY + blockY;
      if (board.board[finalY][finalX]) {
        return true;
      }
    }
    return false;
  }

  private invertCoords(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return this.normalizeRelativeCoords(coords.map(([x, y]) => [y, x]));
  }

  private reflectAlongXAxis(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return this.normalizeRelativeCoords(coords.map(([x, y]) => [x, -y]));
  }

  private reflectAlongYAxis(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    return this.normalizeRelativeCoords(coords.map(([x, y]) => [-x, y]));
  }

  /**
   * Helps transform raw coords immediately after an inversion or reflection into
   * relative coords from the new top-left corner of the transformed piece
   * designated as [0, 0].
   */
  private normalizeRelativeCoords(
    coords: Array<[number, number]>
  ): Array<[number, number]> {
    let minX = Infinity,
      minY = Infinity;
    // Find new top-left corner
    for (const [x, y] of coords) {
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
    }
    // Return all coords as relative to new top-left corner.
    return coords.map(([x, y]) => [x - minX, y - minY]);
  }
}

import DefaultPieceManager, {
  ActivePiece,
  PieceManager,
  PieceManagerErrors,
} from "../active-piece/PieceManager";
import { TetrisBoard } from "../board-renderer/BoardRenderer";
import { Coordinates } from "../common/available_pieces";
import GameStateManager from "../game-state-manager/GameStateManager";

/**
 * The shape of a component that manages various aspects of a tetris game board.
 */
export interface BoardManager {
  /**
   * Spawns a new Tetris piece for the user to control.
   *
   * This should be called at the beginning of EVERY turn.
   */
  initTurn: () => TetrisBoard;

  movePieceLeft: () => TetrisBoard;

  movePieceRight: () => TetrisBoard;

  flipHorizontally: () => TetrisBoard;

  rotateLeft: () => TetrisBoard;

  rotateRight: () => TetrisBoard;

  tickDrop: () => TetrisBoard;
}

/** Default implementation of a manager for the Tetris board. */
export default class DefaultBoardManager implements BoardManager {
  private readonly pieceManager: PieceManager;
  private readonly gameStateManager = GameStateManager.getGameStateManager();
  private currentActivePiece?: ActivePiece;
  private board: TetrisBoard;
  private spawnPoint: Coordinates;

  /** Blocks operations on active piece during turn init/transitions. */
  private pausePieceOperations = true;

  constructor(
    board: TetrisBoard,
    spawnPoint: Coordinates,
    pieceManager?: PieceManager
  ) {
    this.board = board;
    this.spawnPoint = spawnPoint;
    this.pieceManager = pieceManager ?? new DefaultPieceManager();
  }

  initTurn() {
    try {
      const newPiece = this.pieceManager.createNewPiece(
        this.spawnPoint,
        this.board
      );
      this.currentActivePiece = newPiece;
      this.drawOrErasePiece(newPiece);
      this.pausePieceOperations = false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message ===
          PieceManagerErrors.ON_INIT_ACTIVE_PIECE_OUT_OF_BOUNDS
        ) {
          throw new Error(
            "New piece is out of bounds on init; reconfigure the spawn point!"
          );
        } else if (
          error.message ===
          PieceManagerErrors.ON_INIT_ACTIVE_PIECE_COLLIDES_WITH_EXISTING_PARTICLES
        ) {
          this.gameStateManager.setBoardOverflowed(true);
        }
      }
    }
    return { board: [...this.board.board] };
  }

  movePieceLeft() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.moveLeft(piece, board),
      false
    );
  }

  movePieceRight() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.moveRight(piece, board),
      false
    );
  }

  flipHorizontally() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.flipHorizontally(piece, board),
      false
    );
  }

  tickDrop() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.tickDrop(piece, board),
      true
    );
  }

  rotateLeft() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.rotateLeft(piece, board),
      false
    );
  }

  rotateRight() {
    return this.updateActivePieceOnBoardAfterAction(
      (piece: ActivePiece, board: TetrisBoard) =>
        this.pieceManager.rotateRight(piece, board),
      false
    );
  }

  private updateActivePieceOnBoardAfterAction(
    updateBoardFn: (
      piece: ActivePiece,
      board: TetrisBoard
    ) => ActivePiece | null,
    updateTurnAfterAction: boolean
  ): TetrisBoard {
    if (!this.pausePieceOperations) {
      if (!this.currentActivePiece) {
        throw new Error(
          "Initalize a turn first before operating on the board!"
        );
      }
      // TODO: consider whether or not having a "shadow" board would be better than this repainting
      // in case of invalid move - original intent.
      this.drawOrErasePiece(this.currentActivePiece, true);
      const newPiece = updateBoardFn(this.currentActivePiece, this.board);
      if (!!newPiece) {
        this.drawOrErasePiece(newPiece);
        this.currentActivePiece = newPiece;
      } else {
        this.drawOrErasePiece(this.currentActivePiece);
        if (updateTurnAfterAction) this.updateTurn();
      }
    }
    return { board: [...this.board.board] };
  }

  private drawOrErasePiece(piece: ActivePiece, eraseMode: boolean = false) {
    const { anchorPoint, pieceBody } = piece;
    const [prevAnchorX, prevAnchorY] = anchorPoint;
    for (const [x, y] of pieceBody) {
      const finalX = prevAnchorX + x;
      const finalY = prevAnchorY + y;
      this.board.board[finalY][finalX] = !eraseMode;
    }
  }

  private updateTurn() {
    this.pausePieceOperations = true;
    const rowIndicesToRemove: number[] = [];
    for (let i = 0; i < this.board.board.length; i++) {
      const isCompleteRow = this.board.board[i].every((val) => !!val);
      if (isCompleteRow) {
        rowIndicesToRemove.push(i);
      }
    }
    for (const rowIndex of rowIndicesToRemove) {
      const [removedArr] = this.board.board.splice(rowIndex, 1);
      const removedArrLen = removedArr.length;
      this.board.board.unshift(Array(removedArrLen).fill(false));
      this.gameStateManager.incrementRowsCleared(1);
    }
    this.initTurn();
  }
}

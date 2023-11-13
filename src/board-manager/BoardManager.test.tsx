import GameStateManager from "../game-state-manager/GameStateManager";
import DefaultBoardManager, { BoardManager } from "./BoardManager";
import { TetrisBoard } from "../board-renderer/BoardRenderer";
import exp from "constants";

jest.mock("../common/available_pieces", () => {
  const originalModule = jest.requireActual("../common/available_pieces");
  return {
    ...originalModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("../common/available_pieces");

// We could've just gotten the singleton from the GameStateManager itself, but just trying out
// mocking modules with Jest.
jest.mock("../game-state-manager/GameStateManager", () => {
  const originalModule = jest.requireActual(
    "../game-state-manager/GameStateManager"
  );
  const mockGameStateManagerMembers = {
    setBoardOverflowed: jest.fn(),
    incrementRowsCleared: jest.fn(),
  };
  return {
    __esModule: true,
    ...originalModule,
    default: {
      getGameStateManager: () => mockGameStateManagerMembers,
    },
  };
});
const gameStateManagerMock = require("../common/available_pieces");

describe("when initializing a turn", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should not affect board state if init not run", () => {
    const board = defaultBoardManager.movePieceRight();
    const unchangedBoard = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(board.board).toEqual(unchangedBoard);
  });

  it("should allow operations to run their course after initialization", () => {
    let board = defaultBoardManager.initTurn();
    expect(board.board).toEqual([
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
      [false, false, false, false],
    ]);

    board = defaultBoardManager.movePieceLeft();
    const postOpBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(board.board).toEqual(postOpBoard);
  });

  it("should signal if the board has overflown", () => {
    testBoard = {
      board: [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, true, true, false],
      ],
    };
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    const gameStateMock = GameStateManager.getGameStateManager();
    expect(gameStateMock.setBoardOverflowed).toHaveBeenCalledTimes(1);
    expect(gameStateMock.setBoardOverflowed).toHaveBeenCalledWith(true);
  });
});

describe("when moving a piece to the left", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceLeft();
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceLeft();
    // Sqaure was already in this position before left shift
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when moving a piece to the right", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceRight();
    const newBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [2, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.movePieceRight();
    // Sqaure was already in this position before right shift
    const newBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when rotating a piece to the left", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    testBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateLeft();
    const newBoard = [
      [true, true, true, true],
      [true, false, false, true],
      [false, false, false, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateLeft();
    const newBoard = [
      [false, true, false, true],
      [false, true, false, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when rotating a piece to the right", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    testBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateRight();
    const newBoard = [
      [false, false, true, true],
      [true, true, true, true],
      [false, false, false, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.rotateRight();
    const newBoard = [
      [false, true, false, true],
      [false, true, false, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });
});

describe("when flipping a piece horizontally", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    testBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [1, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.flipHorizontally();
    const newBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should leave the board unaltered if the move is invalid", () => {
    const newTestBoard = [
      [false, false, true, true],
      [false, false, true, true],
      [false, false, false, true],
      [false, false, false, true],
    ];
    defaultBoardManager = new DefaultBoardManager(
      { board: newTestBoard },
      [1, 0]
    );
    defaultBoardManager.initTurn();
    defaultBoardManager.flipHorizontally();
    const newBoard = [
      [false, true, true, true],
      [false, true, true, true],
      [false, true, true, true],
      [false, false, false, true],
    ];
    expect(newTestBoard).toEqual(newBoard);
  });
});

describe("when ticking a piece down", () => {
  let defaultBoardManager: BoardManager;
  let testBoard: TetrisBoard;

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    testBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, true, true],
      ],
    };
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should affected the active piece on the board if valid move", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.tickDrop();
    const newBoard = [
      [false, false, false, false],
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, true, true],
    ];
    expect(testBoard.board).toEqual(newBoard);
  });

  it("should start a new turn if the active piece cannot be dropped anymore", () => {
    const testBoard = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [true, true, false, false],
    ];
    defaultBoardManager = new DefaultBoardManager({ board: testBoard }, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [true, true, false, false],
      [true, true, false, false],
      [true, true, false, false],
    ];
    expect(testBoard).toEqual(newBoard);
  });

  it("should remove a full row, updating count", () => {
    defaultBoardManager = new DefaultBoardManager(testBoard, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    // Should now start a new turn
    defaultBoardManager.tickDrop();
    const newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [true, true, false, false],
    ];
    expect(testBoard.board).toEqual(newBoard);
    const gameStateMock = GameStateManager.getGameStateManager();
    expect(gameStateMock.incrementRowsCleared).toHaveBeenCalledTimes(1);
  });

  it("should remove multiple full rows, updating count", () => {
    const testBoard = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, true, true],
      [false, false, true, true],
    ];
    defaultBoardManager = new DefaultBoardManager({ board: testBoard }, [0, 0]);
    defaultBoardManager.initTurn();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    defaultBoardManager.tickDrop();
    // Should not update board yet, even though there is already a full row
    let newBoard = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [true, true, false, false],
      [true, true, true, true],
      [false, false, true, true],
    ];
    expect(testBoard).toEqual(newBoard);
    defaultBoardManager.tickDrop();
    // Should now start a new turn
    defaultBoardManager.tickDrop();
    newBoard = [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];
    expect(testBoard).toEqual(newBoard);
    const gameStateMock = GameStateManager.getGameStateManager();
    expect(gameStateMock.incrementRowsCleared).toHaveBeenCalledTimes(2);
  });
});

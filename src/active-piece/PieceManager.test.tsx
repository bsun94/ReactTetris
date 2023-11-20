import DefaultPieceManager from "./PieceManager";
import { Coordinates } from "../common/available_pieces";

jest.mock("../common/available_pieces", () => {
  const originalModule = jest.requireActual("../common/available_pieces");
  return {
    ...originalModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("../common/available_pieces");

describe("when creating a new piece", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should be able to create with a given anchor point", () => {
    const testAnchor: Coordinates = [0, 1];
    const newPiece = activePieceManager.createNewPiece(testAnchor, testBoard);
    const expectedPiece = {
      anchorPoint: testAnchor,
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    };
    expect(newPiece).toEqual(expectedPiece);
  });

  describe("when the resultant new piece is invalid", () => {
    it("should throw when new piece out of bounds", () => {
      const testAnchor: Coordinates = [3, 0];
      expect(() =>
        activePieceManager.createNewPiece(testAnchor, testBoard)
      ).toThrowError("Active piece is out of board bounds right upon init!");
    });

    it("should throw when new piece collides with existed pieces", () => {
      const newTestBoard = {
        board: [
          [false, false, false, true],
          [false, false, false, true],
          [false, false, false, true],
          [false, false, false, true],
        ],
      };
      activePieceManager = new DefaultPieceManager();
      const testAnchor: Coordinates = [2, 0];
      expect(() =>
        activePieceManager.createNewPiece(testAnchor, newTestBoard)
      ).toThrowError(
        "Active piece collides with existing particles right upon init!"
      );
    });
  });
});

describe("when moving the active piece left", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveLeft(starterPiece, testBoard);
    expect(movedPiece).toEqual({
      anchorPoint: [0, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([0, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [0, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveLeft(starterPiece, testBoard);
    expect(movedPiece).toEqual(null);
  });
});

describe("when moving the active piece right", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveRight(starterPiece, testBoard);
    expect(movedPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([2, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.moveRight(starterPiece, testBoard);
    expect(movedPiece).toEqual(null);
  });
});

describe("when dropping the active piece by a tick", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.tickDrop(starterPiece, testBoard);
    expect(movedPiece).toEqual({
      anchorPoint: [1, 1],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const modifiedTestBoard = {
      board: [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
      ],
    };
    activePieceManager = new DefaultPieceManager();
    const starterPiece = activePieceManager.createNewPiece(
      [1, 1],
      modifiedTestBoard
    );
    expect(starterPiece).toEqual({
      anchorPoint: [1, 1],
      pieceBody: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    });
    const movedPiece = activePieceManager.tickDrop(
      starterPiece,
      modifiedTestBoard
    );
    expect(movedPiece).toEqual(null);
  });
});

describe("when flipping the active piece over horizontally", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.flipHorizontally(
      starterPiece,
      testBoard
    );
    expect(movedPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [1, 0],
        [1, 1],
        [1, 2],
        [0, 2],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const modifiedTestBoard = {
      board: [
        [false, false, true, true],
        [false, false, true, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
    const activePieceManager = new DefaultPieceManager();
    const starterPiece = activePieceManager.createNewPiece(
      [1, 0],
      modifiedTestBoard
    );
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.flipHorizontally(
      starterPiece,
      modifiedTestBoard
    );
    expect(movedPiece).toEqual(null);
  });
});

describe("when rotating the active piece left", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateLeft(starterPiece, testBoard);
    expect(movedPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [2, 0],
        [1, 0],
        [0, 0],
        [0, 1],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const starterPiece = activePieceManager.createNewPiece([2, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [2, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateLeft(starterPiece, testBoard);
    expect(movedPiece).toEqual(null);
  });
});

describe("when rotating the active piece right", () => {
  let activePieceManager: DefaultPieceManager;
  const testBoard = {
    board: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ],
  };

  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.L_SHAPE
    );
    activePieceManager = new DefaultPieceManager();
  });

  afterEach(() => {
    availablePieces.getRandomPiece.mockReset();
  });

  it("should return the piece's new coords if move is valid", () => {
    const starterPiece = activePieceManager.createNewPiece([1, 0], testBoard);
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateRight(starterPiece, testBoard);
    expect(movedPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 0],
      ],
    });
  });

  it("should return null if the move is invalid", () => {
    const modifiedTestBoard = {
      board: [
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
        [false, false, false, true],
      ],
    };
    const activePieceManager = new DefaultPieceManager();
    const starterPiece = activePieceManager.createNewPiece(
      [1, 0],
      modifiedTestBoard
    );
    expect(starterPiece).toEqual({
      anchorPoint: [1, 0],
      pieceBody: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    });
    const movedPiece = activePieceManager.rotateRight(
      starterPiece,
      modifiedTestBoard
    );
    expect(movedPiece).toEqual(null);
  });
});

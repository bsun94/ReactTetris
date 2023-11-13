import GameStateManager from "./GameStateManager";

describe("GameStateManager tests", () => {
  const mockListener = jest.fn();

  afterEach(() => {
    GameStateManager.clearGameStateManagerInstance();
    jest.clearAllMocks();
  });

  it("should only provide a singleton copy of the manager", () => {
    const gameStateManager = GameStateManager.getGameStateManager();
    gameStateManager.subscribe(mockListener);
    gameStateManager.incrementRowsCleared(10);

    // This should grab the same game manager with the same state
    const gameStateManagerTwo = GameStateManager.getGameStateManager();
    const gameState = gameStateManagerTwo.getSnapshot();
    expect(gameState.rowsCleared).toEqual(10);
  });

  it("should be able to update rows cleared state and notify listeners", () => {
    const gameStateManager = GameStateManager.getGameStateManager();
    gameStateManager.subscribe(mockListener);
    gameStateManager.incrementRowsCleared(10);
    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(gameStateManager.getSnapshot()).toEqual({
      rowsCleared: 10,
      isBoardOverflown: false,
    });
  });

  it("should be able to update board overflow and notify listeners", () => {
    const gameStateManager = GameStateManager.getGameStateManager();
    gameStateManager.subscribe(mockListener);
    gameStateManager.setBoardOverflowed(true);
    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(gameStateManager.getSnapshot()).toEqual({
      rowsCleared: 0,
      isBoardOverflown: true,
    });
  });

  it("should be able to reset game state to initial state", () => {
    const gameStateManager = GameStateManager.getGameStateManager();
    gameStateManager.subscribe(mockListener);
    gameStateManager.incrementRowsCleared(2);
    gameStateManager.setBoardOverflowed(true);
    expect(gameStateManager.getSnapshot()).toEqual({
      rowsCleared: 2,
      isBoardOverflown: true,
    });
    expect(mockListener).toHaveBeenCalledTimes(2);
    gameStateManager.resetGameState();
    expect(gameStateManager.getSnapshot()).toEqual({
      rowsCleared: 0,
      isBoardOverflown: false,
    });
    expect(mockListener).toHaveBeenCalledTimes(3);
  });
});

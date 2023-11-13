/** Object encapsulating the current Tetris game state. */
export interface GameState {
  rowsCleared: number;

  /**
   * If there is still space for new pieces to spawn. If there isn't, that means
   * game is over - we've stacked too high.
   */
  isBoardOverflown: boolean;
}

/** Singleton manager of game state for a game of Tetris. */
export default class GameStateManager {
  private listeners: Array<() => void> = [];
  private rowsCleared = 0;
  private isBoardOverflown = false;
  private static instance: GameStateManager | null = null;

  private constructor() {}

  static getGameStateManager(): GameStateManager {
    if (!this.instance) {
      this.instance = new GameStateManager();
    }
    return this.instance;
  }

  // Used mostly for testing; in an application run, singleton usage of this class should be
  // maintained
  static clearGameStateManagerInstance() {
    this.instance = null;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getSnapshot(): GameState {
    return Object.freeze({
      rowsCleared: this.rowsCleared,
      isBoardOverflown: this.isBoardOverflown,
    });
  }

  incrementRowsCleared(additionalRowsCleared: number) {
    this.rowsCleared = this.rowsCleared + additionalRowsCleared;
    this.notifyListeners();
  }

  setBoardOverflowed(isBoardOverflown: boolean) {
    this.isBoardOverflown = isBoardOverflown;
    this.notifyListeners();
  }

  resetGameState() {
    this.rowsCleared = 0;
    this.isBoardOverflown = false;
    this.notifyListeners();
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

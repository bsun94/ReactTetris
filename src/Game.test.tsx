import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Game from "./Game";
import GameStateManager from "./game-state-manager/GameStateManager";

jest.useFakeTimers();

describe("Game tests", () => {
  let gameStateManager: GameStateManager;
  beforeEach(() => {
    gameStateManager = GameStateManager.getGameStateManager();
  });

  afterEach(() => {
    gameStateManager.resetGameState();
  });

  it("should show updated scores", async () => {
    const game = render(<Game />);
    let scoreText = game.findByText("Rows cleared: 0");
    await scoreText;
    expect(scoreText).toBeDefined;
    gameStateManager.incrementRowsCleared(1);
    scoreText = game.findByText("Rows cleared: 1");
    await scoreText;
    expect(scoreText).toBeDefined;
  });

  it("should show the victory screen when 10 rows are cleared", async () => {
    const game = render(<Game />);
    gameStateManager.incrementRowsCleared(10);
    const victoryMessage = game.findByText(/YOU WON!!/);
    await victoryMessage;
    expect(victoryMessage).toBeDefined();
  });

  it("should be able to start a new game from the victory screen", async () => {
    const game = render(<Game />);
    gameStateManager.incrementRowsCleared(10);
    await waitFor(() => {
      game.getByText(/YOU WON!!/);
    });
    const playAgainButton = game.getByText("Play again");
    playAgainButton.click();
    const board = game.container.querySelector("#board");
    expect(board).toBeDefined();
  });

  it("should show the defeat screen when the board is overflown", async () => {
    const game = render(<Game />);
    gameStateManager.setBoardOverflowed(true);
    const defeatMessage = game.findByText(/You lost/);
    await defeatMessage;
    expect(defeatMessage).toBeDefined();
  });

  it("should be able to start a new game from the defeat screen", async () => {
    const game = render(<Game />);
    gameStateManager.setBoardOverflowed(true);
    await waitFor(() => {
      game.getByText(/You lost/);
    });
    const playAgainButton = game.getByText("Play again");
    playAgainButton.click();
    const board = game.container.querySelector("#board");
    expect(board).toBeDefined();
  });
});

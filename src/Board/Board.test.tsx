import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Board from "./Board";
import { convert2dGridIndicesTo1dIndex } from "../common/board_utilities";

jest.useFakeTimers();

jest.mock("../common/available_pieces", () => {
  const originalPiecesModule = jest.requireActual("../common/available_pieces");
  return {
    ...originalPiecesModule,
    getRandomPiece: jest.fn(),
  };
});
const availablePieces = require("../common/available_pieces");

describe("Game board tests", () => {
  beforeEach(() => {
    availablePieces.getRandomPiece.mockImplementation(
      () => availablePieces.SQUARE
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the tetris board", () => {
    const result = render(
      <Board width={4} depth={4} spawnPointX={1} spawnPointY={0} />
    );
    const linkElement = result.container.querySelector("#board");
    expect(linkElement).toBeInTheDocument();
  });

  describe("game mechanics tests", () => {
    function isBoardCellFilled(
      cells: Element[],
      xCoord: number,
      yCoord: number,
      boardDims = { numRows: 4, numCols: 4 }
    ): boolean {
      const index = convert2dGridIndicesTo1dIndex(yCoord, xCoord, boardDims);
      return cells[index].classList.contains("filled");
    }

    it("should tick down the active piece every second", async () => {
      const result = render(
        <Board width={4} depth={4} spawnPointX={1} spawnPointY={0} />
      );
      const boardCells = Array.from(
        result.container.querySelectorAll(".board-renderer-grid-cell")
      );
      expect(isBoardCellFilled(boardCells, 1, 0)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 0)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 1)).toEqual(true);
      // In third row; these should not yet be populated.
      expect(isBoardCellFilled(boardCells, 1, 2)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 2, 2)).toEqual(false);

      jest.advanceTimersByTime(1000);
      // Piece should have floated down one row.
      // waitFor here basically flushes through all re-render tasks.
      await waitFor(() =>
        expect(isBoardCellFilled(boardCells, 1, 0)).toEqual(false)
      );
      expect(isBoardCellFilled(boardCells, 2, 0)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 1, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 2)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 2)).toEqual(true);
    });

    it("should move the active piece on key presses", async () => {
      const result = render(
        <Board width={4} depth={4} spawnPointX={1} spawnPointY={0} />
      );
      const boardCells = Array.from(
        result.container.querySelectorAll(".board-renderer-grid-cell")
      );
      expect(isBoardCellFilled(boardCells, 1, 0)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 0)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 1)).toEqual(true);
      // First column should be blank/unfiled
      expect(isBoardCellFilled(boardCells, 0, 0)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 0, 1)).toEqual(false);

      fireEvent.keyDown(result.container.querySelector("#board")!, {
        key: "a",
      });
      // Piece should have floated to the left
      await waitFor(() =>
        expect(isBoardCellFilled(boardCells, 0, 0)).toEqual(true)
      );
      expect(isBoardCellFilled(boardCells, 0, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 0)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 1)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 2, 0)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 2, 1)).toEqual(false);
    });

    it("should start a new turn when the active piece 'settles'", async () => {
      const result = render(
        <Board width={4} depth={4} spawnPointX={1} spawnPointY={0} />
      );
      const boardCells = Array.from(
        result.container.querySelectorAll(".board-renderer-grid-cell")
      );
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(1000);
      // Previous piece has dropped all the way down
      await waitFor(() =>
        expect(isBoardCellFilled(boardCells, 1, 3)).toEqual(false)
      );
      expect(isBoardCellFilled(boardCells, 2, 3)).toEqual(false);
      // New piece has spawned in
      await waitFor(() => {
        expect(isBoardCellFilled(boardCells, 1, 0)).toEqual(true);
      });
      expect(isBoardCellFilled(boardCells, 2, 0)).toEqual(true);
    });

    it("should clear completed rows", async () => {
      const result = render(
        <Board width={2} depth={4} spawnPointX={0} spawnPointY={0} />
      );
      const boardDims = { numRows: 4, numCols: 2 };
      const boardCells = Array.from(
        result.container.querySelectorAll(".board-renderer-grid-cell")
      );
      // Piece has spawned
      expect(isBoardCellFilled(boardCells, 0, 0, boardDims)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 0, boardDims)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 0, 1, boardDims)).toEqual(true);
      expect(isBoardCellFilled(boardCells, 1, 1, boardDims)).toEqual(true);

      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(1000);
      // Board should be cleared
      await waitFor(() => {
        expect(isBoardCellFilled(boardCells, 0, 0, boardDims)).toEqual(false);
      });
      expect(isBoardCellFilled(boardCells, 1, 0, boardDims)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 0, 1, boardDims)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 1, 1, boardDims)).toEqual(false);
      await waitFor(() => {
        expect(isBoardCellFilled(boardCells, 0, 2, boardDims)).toEqual(false);
      });
      expect(isBoardCellFilled(boardCells, 1, 2, boardDims)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 0, 3, boardDims)).toEqual(false);
      expect(isBoardCellFilled(boardCells, 1, 3, boardDims)).toEqual(false);
    });
  });
});

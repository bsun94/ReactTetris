import { KeyboardEvent, useEffect, useRef, useState } from "react";
import DefaultBoardManager from "../board-manager/BoardManager";
import BoardRenderer from "../board-renderer/BoardRenderer";
import "./Board.css";
import { getPlayingBoard } from "./helpers";

interface BoardProps {
  /** Dimensions of the game board. */
  width: number;
  depth: number;

  /**
   * Where to spawn the active piece. Note that the Y-coord is
   * inverted i.e. 0 = the very top row of the board.
   */
  spawnPointX: number;
  spawnPointY: number;
}

/** View component of the tetris game board. */
export default function Board({
  width,
  depth,
  spawnPointX,
  spawnPointY,
}: BoardProps) {
  // setXXX functions go off of object references - if you mutate the object instead of
  // passing in a new one, setXXX won't actually trigger renders as it should.
  const [board, setBoard] = useState(getPlayingBoard(width, depth));
  const boardManager = useRef(
    new DefaultBoardManager({ board }, [spawnPointX, spawnPointY])
  ).current;
  // This has to be a useRef; if useState, during the double useEffect run mentioned below, state
  // is not immediately updated - it behaves in the "snapshot" way React docs describes and we
  // double init the board's active piece.
  const gameStarted = useRef(false);
  const gameBoardElement = useRef(null);

  useEffect(() => {
    if (!!gameBoardElement.current) {
      (gameBoardElement.current as HTMLElement).focus();
    }
    // If put this outside useEffect, it'll get run 4 times: twice b/c of strictMode in dev, and
    // for each of those, twice b/c setBoard triggers another render.
    if (!gameStarted.current) {
      // Can't have this outside the if in the useEffect; the order in which Reach double-runs
      // the component in strictMode is everything outside useEffect gets run twice first, then
      // useEffect runs twice consecutively after component has mounted.
      setBoard(boardManager.initTurn().board);
      gameStarted.current = true;
    }
    // Won't work in dev if in above if statement; useEffect run twice, and `if` only
    // triggered on first time, clean-up gets called after.
    const gameLoop = setInterval(
      () => setBoard(boardManager.tickDrop().board),
      1000
    );
    return () => {
      clearInterval(gameLoop);
    };
  }, []);

  const handleKeyDownEvent = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    switch (key) {
      case "a":
        setBoard(boardManager.movePieceLeft().board);
        return;
      case "s":
        setBoard(boardManager.tickDrop().board);
        return;
      case "d":
        setBoard(boardManager.movePieceRight().board);
        return;
      case "j":
        setBoard(boardManager.rotateLeft().board);
        return;
      case "k":
        setBoard(boardManager.flipHorizontally().board);
        return;
      case "l":
        setBoard(boardManager.rotateRight().board);
        return;
      default:
        // ignore other key presses.
        return;
    }
  };
  // Event handlers only register on div elements with tabIndex set
  return (
    <div
      id="board"
      ref={gameBoardElement}
      onKeyDown={(e) => handleKeyDownEvent(e)}
      tabIndex={0}
    >
      <BoardRenderer board={board} />
    </div>
  );
}

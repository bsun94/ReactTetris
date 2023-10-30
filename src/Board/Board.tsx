import { KeyboardEvent, useEffect, useRef, useState } from "react";
import DefaultBoardManager from "../board-manager/BoardManager";
import BoardRenderer from "../board-renderer/BoardRenderer";
import "./Board.css";

// CSS styling for board currently based on this many blocks;
// do not change unless we've figured out a more dynamic way to style in CSS
// TODO: consider https://stackoverflow.com/questions/52005083/how-to-define-css-variables-in-style-attribute-in-react-and-typescript
function getPlayingBoard() {
  return [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
  ];
}

/** View component of the tetris game board. */
export default function Board() {
  // setXXX functions go off of object references - if you mutate the object instead of
  // passing in a new one, setXXX won't actually trigger renders as it should.
  const [board, setBoard] = useState(getPlayingBoard());
  const [boardManager] = useState(new DefaultBoardManager({ board }, [4, 0]));
  // This has to be a useRef; if useState, during the double useEffect run mentioned below, state
  // is not immediately updated - it behaves in the "snapshot" way React docs describes and we
  // double init the board's active piece.
  const gameStarted = useRef(false);

  useEffect(() => {
    // If put this outside useEffect, it'll get run 4 times: twice b/c of strictMode in dev, and
    // for each of those, twice b/c setBoard triggers another render.
    if (!gameStarted.current) {
      // Can't have this outside the if in the useEffect; the order in which Reach double-runs
      // the component in strictMode is everything outside useEffect gets run twice first, then
      // useEffect runs twice consecutively after component has mounted.
      setBoard(boardManager.initTurn().board);
      gameStarted.current = true;
    }
    // Won't work in dev if in above if statement; useEffect run twice, and if only
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
    <div id="board" onKeyDown={(e) => handleKeyDownEvent(e)} tabIndex={0}>
      <BoardRenderer board={board} />
    </div>
  );
}

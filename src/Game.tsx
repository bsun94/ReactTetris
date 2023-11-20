import React, {
  MouseEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import "./App.css";
import Board from "./Board/Board";
import "./Game.css";
import GameStateManager from "./game-state-manager/GameStateManager";

type GameStates = "gameOn" | "gameWon" | "gameLost";
const victoryThreshold = 10; /* rows cleared */

/** Component that encapsulates the entire tetris game. */
export default function Game() {
  const gameStateManager = useRef(
    GameStateManager.getGameStateManager()
  ).current;
  const gameStateData = useSyncExternalStore(
    gameStateManager.subscribe,
    gameStateManager.getSnapshot
  );
  const [gameState, setGameState] = useState<GameStates>("gameOn");
  // setXXXState triggers a rerendering of the component, and that means that all the code inside
  // of the component is rerun. If we don't if-guard this with gameState, setGameStates below will
  // keep getting run every time React calls Component(props).
  if (gameState !== "gameLost" && gameStateData.isBoardOverflown) {
    setGameState("gameLost");
  } else if (
    gameState !== "gameWon" &&
    gameStateData.rowsCleared >= victoryThreshold
  ) {
    setGameState("gameWon");
  }

  const playAgain = (event: MouseEvent) => {
    gameStateManager.resetGameState();
    setGameState("gameOn");
  };

  if (gameState === "gameOn") {
    return (
      <>
        <Board width={9} depth={15} spawnPointX={4} spawnPointY={0} />
        <div id="game-score">Rows cleared: {gameStateData.rowsCleared}</div>
      </>
    );
  } else if (gameState === "gameWon") {
    return (
      <div className="game-state-dialog">
        <div className="game-state-text">🎉🍾YOU WON!!🎉🍾</div>
        <button className="play-again-button" onClick={(e) => playAgain(e)}>
          Play again
        </button>
      </div>
    );
  } else if (gameState === "gameLost") {
    return (
      <div className="game-state-dialog">
        <div className="game-state-text">
          You lost 😢💔 better luck next time!
        </div>
        <button className="play-again-button" onClick={(e) => playAgain(e)}>
          Play again
        </button>
      </div>
    );
  } else {
    return <>Game error - the game is in an invalid state.</>;
  }
}

import React, { useSyncExternalStore } from "react";
import "./App.css";
import Board from "./Board/Board";

/** Component that encapsulates the entire tetris game. */
export default function Game() {
  return <Board width={9} depth={15} spawnPointX={4} spawnPointY={0} />;
}

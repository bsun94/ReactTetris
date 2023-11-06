import React from "react";
import "./App.css";
import Board from "./Board/Board";

function App() {
  return <Board width={9} depth={15} spawnPointX={4} spawnPointY={0} />;
}

export default App;

import React from "react";
import { render, screen } from "@testing-library/react";
import Board from "./Board";

test("renders learn react link", () => {
  const result = render(<Board />);
  const linkElement = result.container.querySelector("#board");
  expect(linkElement).toBeInTheDocument();
});

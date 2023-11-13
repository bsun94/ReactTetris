import React from "react";
import { render, screen } from "@testing-library/react";
import Game from "./Game";

test("renders learn react link", () => {
  const result = render(<Game />);
  const linkElement = result.container.querySelector("#board");
  expect(linkElement).toBeInTheDocument();
});

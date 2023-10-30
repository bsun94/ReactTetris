import { act } from "@testing-library/react";
import { createRoot, Root } from "react-dom/client";

import BoardRenderer from "./BoardRenderer";

let container: Element | null = null;
let root: Root | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container!);
});

afterEach(() => {
  act(() => {
    if (!!root) {
      root.unmount();
    }
  });
});

it("renders without crashing", () => {
  const testBoard = [
    [false, false, false],
    [false, true, false],
    [true, true, true],
  ];
  expect(() => {
    root!.render(<BoardRenderer board={testBoard} />);
  }).not.toThrow();
});

it("should render a board with cells filled in at the correct spots", () => {
  const testBoard = [
    [false, false, false],
    [false, true, false],
    [true, true, true],
  ];
  act(() => {
    root!.render(<BoardRenderer board={testBoard} />);
  });
  const cells = Array.from(
    container?.querySelectorAll(".board-renderer-grid-cell")!
  );
  expect(cells[3].classList.contains("filled")).toEqual(false);
  expect(cells[4].classList.contains("filled")).toEqual(true);
  expect(cells[5].classList.contains("filled")).toEqual(false);
  expect(cells[6].classList.contains("filled")).toEqual(true);
});

it("should updated filled spots on the board with new inputs", () => {
  let testBoard = [
    [true, false],
    [false, true],
  ];
  act(() => {
    root!.render(<BoardRenderer board={testBoard} />);
  });
  let cells = Array.from(
    container?.querySelectorAll(".board-renderer-grid-cell")!
  );
  expect(cells[0].classList.contains("filled")).toEqual(true);
  expect(cells[1].classList.contains("filled")).toEqual(false);
  expect(cells[2].classList.contains("filled")).toEqual(false);
  expect(cells[3].classList.contains("filled")).toEqual(true);

  testBoard = [
    [false, true],
    [true, false],
  ];
  act(() => {
    root!.render(<BoardRenderer board={testBoard} />);
  });
  cells = Array.from(container?.querySelectorAll(".board-renderer-grid-cell")!);
  expect(cells[0].classList.contains("filled")).toEqual(false);
  expect(cells[1].classList.contains("filled")).toEqual(true);
  expect(cells[2].classList.contains("filled")).toEqual(true);
  expect(cells[3].classList.contains("filled")).toEqual(false);
});

**Future extension ideas:**

- Piece preview - a new pane somewhere that shows what the next piece is going to be.
- Piece storage & swapping - ability to swap out & store the current active piece somewhere and play with a new piece, but then swap in a storaged piece for a currently-active piece at will?
- Pre-game configs? User gets to pick game board dimensions as well as difficulty level:
  - Variable difficulty levels based on the interval length in `Board`'s `setInterval` task? (Harder = pieces tick down faster). As well as victory threshold -> harder = more rows need to be cleared?
- In BoardRenderer.tsx, can we update the `TetrisBoard` interface and cell generators like `getFilledGridCell` in order to accommodate multi-coloured pieces?
- Style the whole thing up a bit more so it's got more visual pazzaz?

**Clean-ups:**

- `BoardRenderer.css` currently formats the grid layout based on hard-coded values, but board generation in Board/helpers.ts takes in variable arguments. Consider using [this](https://stackoverflow.com/questions/52005083/how-to-define-css-variables-in-style-attribute-in-react-and-typescript) to define CSS variables for #rows and #cols to make it more dynamic.
- In BoardManager.tsx, we always have the active piece painted onto the board. This results in what seems to be a do-then-undo op in `updateActivePieceOnBoardAfterAction` to erase the active piece in order to avoid false collision when determining the validity of the newly generated piece after a transform, then painting it back on should the transform be invalid. Since we return copies of the board to the view component anyhow to trigger `setStates`, consider not making the active piece a part of the board until turn is over.
- In BoardRenderer.tsx, is there a way to generate/cache the board cells so that we don't regen them so much?

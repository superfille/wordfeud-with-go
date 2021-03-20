import { solveColumns } from "./ColumnSolver";
import { solveRows } from "./RowSolver";

export const solve = (board, playerChars) => {
  const result = [
    ...solveColumns(board, playerChars), 
    ...solveRows(board, playerChars)
    ]
  postMessage(result);
}

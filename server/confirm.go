package main

func canGoLeft(row int, column int, board *Board) bool {
	return column-1 >= 0 && board.tiles[row][column-1].c != ""
}

func canGoRight(row int, column int, board *Board) bool {
	return column+1 < boardLength && board.tiles[row][column+1].c != ""
}

func canGoUp(row int, column int, board *Board) bool {
	return row-1 >= 0 && board.tiles[row-1][column].c != ""
}

func canGoDown(row int, column int, board *Board) bool {
	return row+1 < boardLength && board.tiles[row+1][column].c != ""
}

func totalNumberOfCharsInBoard(board *Board) int {
	count := 0
	for row := 0; row < boardLength; row++ {
		for column := 0; column < boardLength; column++ {
			if board.tiles[row][column].c != "" {
				count += 1
			}
		}
	}

	return count
}

func hasVisited(row int, column int, visited []Position) bool {
	for i := 0; i < len(visited); i++ {
		if visited[i].row == row && visited[i].column == column {
			return true
		}
	}
	return false
}

func findFirstChar(board *Board) Position {
	for row := 0; row < boardLength; row++ {
		for column := 0; column < boardLength; column++ {
			if board.tiles[row][column].c != "" {
				return Position{
					row:    row,
					column: column,
				}
			}
		}
	}

	return Position{
		row:    -1,
		column: -1,
	}
}

func searchLabyrint(row int, column int, board *Board, visited []Position, count int) int {
	visited = append(visited, Position{row: row, column: column})

	if canGoRight(row, column, board) && !hasVisited(row, column+1, visited) {
		count = searchLabyrint(row, column+1, board, visited, count+1)
	}

	if canGoDown(row, column, board) && !hasVisited(row+1, column, visited) {
		count = searchLabyrint(row+1, column, board, visited, count+1)
	}

	if canGoLeft(row, column, board) && !hasVisited(row, column-1, visited) {
		count = searchLabyrint(row, column-1, board, visited, count+1)
	}

	if canGoUp(row, column, board) && !hasVisited(row-1, column, visited) {
		count = searchLabyrint(row-1, column, board, visited, count+1)
	}

	return count
}

func wordsAreConnected(board *Board) bool {
	charsInBoard := totalNumberOfCharsInBoard(board)
	positionOfFirst := findFirstChar(board)

	if positionOfFirst.column >= 0 && positionOfFirst.row >= 0 {
		return searchLabyrint(positionOfFirst.row, positionOfFirst.column, board, []Position{}, 1) == charsInBoard
	}
	return true
}

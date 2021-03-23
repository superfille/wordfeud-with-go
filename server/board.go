package main

import (
	"fmt"
	"strconv"
	"strings"
)

var boardLength int = 15

type Board struct {
	tiles [15][15]Tile
}

type Tile struct {
	x     int
	y     int
	c     string
	s     string
	fixed bool
}

type Position struct {
	row    int
	column int
}

func (board *Board) initializeBoard() {
	for x := 0; x < boardLength; x++ {
		for y := 0; y < boardLength; y++ {
			board.tiles[x][y] = Tile{
				x:     x,
				y:     y,
				c:     "",
				s:     getSpecialCharacter(x, y),
				fixed: false,
			}
		}
	}
}

func isPosition(x int, y int, positions []Position) bool {
	for i := 0; i < len(positions); i++ {
		if positions[i].row == x && positions[i].column == y {
			return true
		}
	}
	return false
}

func getSpecialCharacter(x int, y int) string {
	twPositions := []Position{{0, 4}, {0, 10}, {4, 0}, {4, 14}, {10, 0}, {10, 14}, {14, 4}, {14, 10}}
	tlPositions := []Position{{0, 0}, {0, 14}, {1, 5}, {1, 9}, {3, 3}, {3, 11}, {5, 1}, {5, 5}, {5, 9}, {5, 13}, {9, 1}, {9, 5}, {9, 9}, {9, 13}, {11, 3}, {11, 11}, {13, 5}, {13, 9}, {14, 0}, {14, 14}}
	dlPoisitions := []Position{{0, 7}, {1, 1}, {1, 13}, {2, 6}, {2, 8}, {4, 6}, {4, 8}, {6, 2}, {6, 4}, {6, 10}, {6, 12}, {7, 0}, {7, 14}, {8, 2}, {8, 4}, {8, 10}, {8, 12}, {10, 6}, {10, 8}, {12, 6}, {12, 8}, {13, 1}, {13, 13}, {14, 7}}
	dwPositions := []Position{{2, 2}, {2, 12}, {3, 7}, {4, 4}, {4, 10}, {7, 3}, {7, 11}, {10, 4}, {10, 10}, {11, 7}, {12, 2}, {12, 12}}

	if isPosition(x, y, twPositions) {
		return "tw"
	}

	if isPosition(x, y, tlPositions) {
		return "tl"
	}

	if isPosition(x, y, dlPoisitions) {
		return "dl"
	}

	if isPosition(x, y, dwPositions) {
		return "dw"
	}
	return ""
}

func convertStringToInt(char string) int {
	result, err := strconv.Atoi(char)
	if err != nil {
		return -1
	}

	return result
}

func (board *Board) parseRequest(boardAsString string) {
	savedBoard := strings.Split(boardAsString, ";")
	// -1 because the split adds an empty value at the end
	for i := 0; i < len(savedBoard)-1; i++ {
		split := strings.Split(savedBoard[i], ",")
		x := convertStringToInt(split[0])
		y := convertStringToInt(split[1])
		c := split[2]

		board.tiles[x][y].c = c
		board.tiles[x][y].fixed = true
	}
}

func (board *Board) isStartOfHorizontalWord(row int, column int) bool {
	// No char in this tile
	if board.tiles[row][column].c == "" {
		return false
	}

	// At the start of the board and tile to right is a char
	if column == 0 {
		if board.tiles[row][column+1].c != "" {
			return true
		}
		return false
	}

	// At the end of the board
	if column == boardLength-1 {
		return false
	}

	// Somewhere in the board where there is no char to the left but one to the right
	if board.tiles[row][column-1].c == "" && board.tiles[row][column+1].c != "" {
		return true
	}

	return false
}

func (board *Board) getHorizontalWord(row int, column int) string {
	lastColumnOfWord := column
	word := ""

	for lastColumnOfWord < boardLength && board.tiles[row][lastColumnOfWord].c != "" {
		word += board.tiles[row][lastColumnOfWord].c
		lastColumnOfWord += 1
	}

	return word
}

func (board *Board) isStartOfVerticalWord(row int, column int) bool {
	// No char in this tile
	if board.tiles[row][column].c == "" {
		return false
	}

	// At the start of the board and a char is beneath this tile
	if row == 0 {
		if board.tiles[row+1][column].c != "" {
			return true
		}
		return false
	}

	// At the end of the board
	if row == boardLength-1 {
		return false
	}

	// Somewhere in the board where there is no char above but there is one beneath
	if board.tiles[row-1][column].c == "" && board.tiles[row+1][column].c != "" {
		return true
	}

	return false
}

func (board *Board) getVerticalWord(row int, column int) string {
	lastRowOfWord := row
	word := ""

	for lastRowOfWord < boardLength && board.tiles[lastRowOfWord][column].c != "" {
		word += board.tiles[lastRowOfWord][column].c
		lastRowOfWord += 1
		if lastRowOfWord > 100 {
			break
		}
	}

	return word
}

func (board *Board) isValid() bool {
	if !wordsAreConnected(board) {
		// fmt.Println("Board is not connected")
		return false
	}

	var invalidWords []string

	for row := 0; row < boardLength; row++ {
		for column := 0; column < boardLength; column++ {
			if board.isStartOfHorizontalWord(row, column) {
				word := board.getHorizontalWord(row, column)

				if !lib.isWord(word) {
					invalidWords = append(invalidWords, word)
				}
			}

			if board.isStartOfVerticalWord(row, column) {
				word := board.getVerticalWord(row, column)
				if !lib.isWord(word) {
					invalidWords = append(invalidWords, word)
				}
			}
		}
	}
	return len(invalidWords) == 0
}

func (board *Board) printBoard() {
	for row := 0; row < boardLength; row++ {
		columns := strconv.Itoa(row + 1)
		if row < 9 {
			columns += "  | "
		} else {
			columns += " | "
		}
		if row == 0 {
			columnIndexes := "     "
			for i := 0; i < boardLength; i++ {
				if i < 9 {
					if i == 8 {
						columnIndexes += strconv.Itoa(i+1) + "  "
					} else {
						columnIndexes += strconv.Itoa(i+1) + "   "
					}
				} else {
					columnIndexes += strconv.Itoa(i+1) + "  "
				}
			}
			fmt.Println(columnIndexes)
		}
		for column := 0; column < boardLength; column++ {
			if board.tiles[row][column].c == "" {
				columns += "X" + " | "
			} else {
				columns += board.tiles[row][column].c + " | "
			}
		}
		fmt.Println(columns)
	}
}

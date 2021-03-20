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
				fixed: false,
			}
		}
	}
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
		fmt.Println("Board is not connected")
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

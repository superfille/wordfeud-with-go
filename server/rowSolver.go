package main

import (
	"strings"
)

type RowSolver struct {
	board Board
}

func (solver *RowSolver) solveRows(chars string) []MatchedWord {
	list := []MatchedWord{}

	for row := 0; row < boardLength; row++ {

		matcheds := solver.solveRow(chars, row)

		for i := 0; i < len(matcheds); i++ {
			list = append(list, matcheds[i])
		}
	}

	return list
}

func (rowSolver *RowSolver) solveRow(playerChars string, row int) []MatchedWord {
	result := []MatchedWord{}

	for column := 0; column < boardLength; column++ {
		if column > 0 && hasChar(&rowSolver.board, row, column-1) {
			// We start words when there is nothing above
			continue
		}

		constructedWord := getConstructedRow(&rowSolver.board, len(playerChars), row, column)
		if constructedWord != "" {

			cMatch := WordMatch{
				constructedWord: constructedWord,
				playerChars:     playerChars,
				board:           &rowSolver.board,
				row:             row,
				column:          column,
			}

			matches := wordsThatMatchPositions(&cMatch, "row")

			// result
			matches = filterMatchedWords(func(matchedWord MatchedWord) bool {
				return rowSolver.wordIsValidInBoard(&matchedWord)
			})(matches)

			matches = mapMatched(func(matchedWord MatchedWord) MatchedWord {
				matchedWord.points = rowSolver.countPoints(&matchedWord)
				return matchedWord
			})(matches)

			for i := 0; i < len(matches); i++ {
				result = append(result, matches[i])
			}
		}
	}

	return result
}

func getConstructedRow(board *Board, playerLength int, row int, startColumn int) string {
	charsUsed := 0
	column := startColumn
	index := 0
	constructedWord := ""

	for column < boardLength {
		if hasChar(board, row, column) {
			constructedWord += board.tiles[row][column].c
			index++
			column++
			continue
		}

		if charsUsed < playerLength {
			constructedWord += "*"
		}

		charsUsed++

		// The next tile is not the end of the board and is not empty, we can continue
		if column+1 < boardLength && hasChar(board, row, column+1) {
			index++
			column++
			continue
		}

		if charsUsed >= playerLength {
			break
		}
		index++
		column++
	}

	splitted := strings.Split(constructedWord, "")
	noStar := someString(splitted, func(c1 string) bool { return c1 != "*" })
	hasStar := someString(splitted, func(c1 string) bool { return c1 == "*" })

	if noStar && hasStar {
		return constructedWord
	}

	return ""
}

func (rowSolver *RowSolver) countPoints(rowWord *MatchedWord) int {
	rowSolver.board.addMatchedWord(rowWord)

	points := countAllPoints(&rowSolver.board)

	rowSolver.board.removeMatchedWord(rowWord)

	return points
}

func (rowSolver *RowSolver) wordIsValidInBoard(rowWord *MatchedWord) bool {
	rowSolver.board.addMatchedWord(rowWord)

	isValid := rowSolver.board.isValid()

	rowSolver.board.removeMatchedWord(rowWord)

	return isValid
}

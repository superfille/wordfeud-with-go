package main

import (
	"strings"
)

type Solver struct {
	board       *Board
	direction   string // row or column
	playerChars string
}

type MatchedWord struct {
	word                 string
	points               int
	hasNotFinalCharacter bool
	row                  int
	column               int
}

type WordMatch struct {
	constructedWord string // Could be *be*apa  [][b][e][][a][p][a];
	row             int
	column          int
}

func (solver *Solver) solve(chars string, direction string) []MatchedWord {
	list := []MatchedWord{}
	solver.direction = direction
	solver.playerChars = chars

	if solver.direction == "column" {
		for column := 0; column < boardLength; column++ {
			for row := 0; row < boardLength; row++ {
				list = append(list, solver.solveMe(row, column)...)
			}
		}
	} else if solver.direction == "row" {
		for row := 0; row < boardLength; row++ {
			for column := 0; column < boardLength; column++ {
				list = append(list, solver.solveMe(row, column)...)
			}
		}
	}

	return list
}

func (solver *Solver) solveMe(row int, column int) []MatchedWord {
	result := []MatchedWord{}

	if solver.isTileBeforePopulated(row, column) {
		return result
	}

	constructedWord := solver.getConstructed(row, column)
	if constructedWord != "" {
		match := WordMatch{
			constructedWord: constructedWord,
			row:             row,
			column:          column,
		}

		matches := solver.wordsThatMatchPositions(&match)

		for index := 0; index < len(matches); index++ {
			points := solver.board.getPoints(&matches[index], solver.direction)
			if points > 0 {
				matches[index].points = points
				result = append(result, matches[index])
			}
		}
	}
	return result
}

func (solver Solver) getConstructed(row int, column int) string {
	charsUsed := 0
	index := 0
	constructedWord := ""

	increase := func() {
		index++
		if solver.direction == "column" {
			row++
		} else {
			column++
		}
	}

	nextTileIsOK := func() bool {
		if solver.direction == "column" {
			return row+1 < boardLength && solver.board.hasChar(row+1, column)
		}
		return column+1 < boardLength && solver.board.hasChar(row, column+1)
	}

	for row < boardLength && column < boardLength {
		if solver.board.hasChar(row, column) {
			constructedWord += solver.board.tiles[row][column].c
			increase()
			continue
		}

		if charsUsed < len(solver.playerChars) {
			constructedWord += "*"
		}

		charsUsed++

		// The next tile is not the end of the board and is not empty, we can continue
		if nextTileIsOK() {
			increase()
			continue
		}
		// TODO: Move this to just below charsUsed++
		if charsUsed >= len(solver.playerChars) {
			break
		}
		increase()
	}

	splitted := strings.Split(constructedWord, "")
	noStar := false
	hasStar := false

	for _, value := range splitted {
		if value != "*" {
			noStar = true
		} else {
			hasStar = true
		}
	}

	if hasStar && noStar {
		return constructedWord
	}
	return ""
}

func (solver Solver) wordsThatMatchPositions(payload *WordMatch) []MatchedWord {
	result := []MatchedWord{}

	for index := 0; index < len(library.words); index++ {
		word := library.words[index]
		if len(word) <= 1 || len(word) > len(payload.constructedWord) || solver.isTileAfterPopulated(word, payload) {
			continue
		}
		position := isWordFine(word, payload.constructedWord, solver.playerChars)
		if position >= 0 {
			if solver.direction == "column" {
				result = append(result, MatchedWord{
					word:                 word,
					hasNotFinalCharacter: false,
					row:                  payload.row + position,
					column:               payload.column,
					points:               0,
				})
			} else {
				result = append(result, MatchedWord{
					word:                 word,
					hasNotFinalCharacter: false,
					row:                  payload.row,
					column:               payload.column + position,
					points:               0,
				})
			}

		}
	}

	return result
}

func (solver *Solver) isTileBeforePopulated(row int, column int) bool {
	if solver.direction == "column" {
		return row > 0 && solver.board.hasChar(row-1, column)
	}
	return column > 0 && solver.board.hasChar(row, column-1)
}

func (solver *Solver) isTileAfterPopulated(word string, wordMatch *WordMatch) bool {
	if solver.direction == "column" {
		if wordMatch.row+len(word) < boardLength {
			return solver.board.hasChar(wordMatch.row+len(word), wordMatch.column)
		}
	} else {
		if wordMatch.column+len(word) < boardLength {
			return solver.board.hasChar(wordMatch.row, wordMatch.column+len(word))
		}
	}

	return false
}

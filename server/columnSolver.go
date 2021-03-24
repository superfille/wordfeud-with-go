package main

import (
	"strings"
)

type MatchedWord struct {
	word                 string
	points               int
	direction            string // 'row' | 'column',
	hasNotFinalCharacter bool
	row                  int
	column               int
}

type WordMatch struct {
	constructedWord string // Could be *be*apa  [][b][e][][a][p][a];
	playerChars     string
	board           *Board
	row             int
	column          int
}

type ColumnSolver struct {
	board Board
}

func (solver *ColumnSolver) solveColumns(chars string) []MatchedWord {
	list := []MatchedWord{}

	for column := 0; column < boardLength; column++ {

		matcheds := solver.solveColumn(chars, column)

		for i := 0; i < len(matcheds); i++ {
			list = append(list, matcheds[i])
		}
	}

	return list
}

func (solver *ColumnSolver) solveColumn(playerChars string, column int) []MatchedWord {
	result := []MatchedWord{}

	for row := 0; row < boardLength; row++ {
		if row > 0 && hasChar(&solver.board, row-1, column) {
			// We start words when there is nothing above
			continue
		}

		constructedWord := getConstructedColumn(&solver.board, len(playerChars), row, column)

		if constructedWord != "" {
			cMatch := WordMatch{
				constructedWord: constructedWord,
				playerChars:     playerChars,
				board:           &solver.board,
				row:             row,
				column:          column,
			}

			matches := wordsThatMatchPositions(&cMatch, "column")

			// result
			matches = filterMatchedWords(func(matchedWord MatchedWord) bool {
				return solver.wordIsValidInBoard(&matchedWord)
			})(matches)

			matches = mapMatched(func(matchedWord MatchedWord) MatchedWord {
				matchedWord.points = solver.countColumnPointsHelper(&matchedWord)
				return matchedWord
			})(matches)

			for i := 0; i < len(matches); i++ {
				result = append(result, matches[i])
			}
		}
	}

	return result
}

func getConstructedColumn(board *Board, playerLength int, startRow int, column int) string {
	charsUsed := 0
	row := startRow
	index := 0
	constructedWord := ""

	for row < boardLength {
		if hasChar(board, row, column) {
			constructedWord += board.tiles[row][column].c
			index++
			row++
			continue
		}

		if charsUsed < playerLength {
			constructedWord += "*"
		}

		charsUsed++

		// The next tile is not the end of the board and is not empty, we can continue
		if row+1 < boardLength && hasChar(board, row+1, column) {
			index++
			row++
			continue
		}

		if charsUsed >= playerLength {
			break
		}
		index++
		row++
	}

	splitted := strings.Split(constructedWord, "")
	noStar := someString(splitted, func(c1 string) bool { return c1 != "*" })
	hasStar := someString(splitted, func(c1 string) bool { return c1 == "*" })

	if noStar && hasStar {
		return constructedWord
	}

	return ""
}

func positionAfterCurrentWordIsEmpty(word string, columnMatch *WordMatch) bool {
	if columnMatch.row+len(word) < boardLength {
		if hasChar(columnMatch.board, columnMatch.row+len(word), columnMatch.column) {
			return false
		}
	}
	return true
}

func wordsThatMatchPositions(payload *WordMatch, direction string) []MatchedWord {
	init := []MatchedWord{}
	return reduceMatchedWords(library.words, init,
		func(accumulated []MatchedWord, libraryWord string) []MatchedWord {
			if len(libraryWord) <= 1 || len(libraryWord) > len(payload.constructedWord) {
				return accumulated
			}

			if !positionAfterCurrentWordIsEmpty(libraryWord, payload) {
				return accumulated
			}

			if isWordFine(libraryWord, payload.constructedWord, payload.playerChars) {
				return append(accumulated, MatchedWord{
					word:      libraryWord,
					direction: direction,
					row:       payload.row,
					column:    payload.column,
					points:    0,
				})
			}

			return accumulated
		})
}

func setColumnWordInBoard(columnWord *MatchedWord, board *Board) {
	for i := 0; i < len(columnWord.word); i++ {
		if board.tiles[columnWord.row+i][columnWord.column].fixed == false {
			board.tiles[columnWord.row+i][columnWord.column].c = string(columnWord.word[i])
		}
	}
}

func removeColumnWordFromBoard(columnWord *MatchedWord, board *Board) {
	for i := 0; i < len(columnWord.word); i++ {
		if board.tiles[columnWord.row+i][columnWord.column].fixed == false {
			board.tiles[columnWord.row+i][columnWord.column].c = ""
		}
	}
}

func (columnSolver ColumnSolver) countColumnPointsHelper(columnWord *MatchedWord) int {
	setColumnWordInBoard(columnWord, &columnSolver.board)

	points := countPoints(&columnSolver.board)

	removeColumnWordFromBoard(columnWord, &columnSolver.board)

	return points
}

func (columnSolver ColumnSolver) wordIsValidInBoard(columnWord *MatchedWord) bool {
	setColumnWordInBoard(columnWord, &columnSolver.board)

	isValid := columnSolver.board.isValid()

	removeColumnWordFromBoard(columnWord, &columnSolver.board)

	return isValid
}

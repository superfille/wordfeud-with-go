package main

import (
	"strings"
)

type ColumnMatch struct {
	allWords        []string
	constructedWord string // Could be *be*apa  [][b][e][][a][p][a];
	playerChars     string
	board           *Board
	row             int
	column          int
}

type MatchedWord struct {
	word                 string
	points               int
	direction            string // 'row' | 'column',
	hasNotFinalCharacter bool
	row                  int
	column               int
}

func getConstructedWordFromBoard(board *Board, start int, playerLength int, column int) string {
	charsUsed := 0
	row := start
	index := 0
	constructedWord := ""

	for row < boardLength {
		if hasChar(board, row, column) {
			constructedWord += board.tiles[row][column].c
			index += 1
			row += 1
			continue
		}

		if charsUsed < playerLength {
			constructedWord += "*"
		}

		charsUsed += 1

		// The next tile is not the end of the board and is not empty, we can continue
		if row+1 < boardLength && hasChar(board, row+1, column) {
			index += 1
			row += 1
			continue
		}

		if charsUsed >= playerLength {
			break
		}
		index += 1
		row += 1
	}

	splitted := strings.Split(constructedWord, "")
	noStar := someString(splitted, func(c1 string) bool { return c1 != "*" })
	hasStar := someString(splitted, func(c1 string) bool { return c1 == "*" })
	if noStar && hasStar {
		return constructedWord
	}

	return ""
}

func positionAfterCurrentWordIsEmpty(word string, columnMatch ColumnMatch) bool {
	if columnMatch.row+len(word) < boardLength {
		if hasChar(columnMatch.board, columnMatch.row+len(word), columnMatch.column) {
			return false
		}
	}
	return true
}

func wordsThatMatchPositions(payload ColumnMatch) []MatchedWord {
	init := []MatchedWord{}
	return reduceMatchedWords(payload.allWords, init,
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
					direction: "column",
					row:       payload.row,
					column:    payload.column,
					points:    0,
				})
			}

			return accumulated
		})
}

func solveColumn(playerChars string, board *Board, column int) []MatchedWord {
	result := []MatchedWord{}

	for row := 0; row < boardLength; row++ {
		if row > 0 && hasChar(board, row-1, column) {
			// We start words when there is nothing above
			continue
		}

		constructedWord := getConstructedWordFromBoard(board, row, column, len(playerChars))

		if constructedWord != "" {
			cMatch := ColumnMatch{
				allWords:        []string{"hej"}, //WordHandler.Instance.getWordsWithAtLeastLength(constructedWord.length),
				constructedWord: constructedWord,
				playerChars:     playerChars,
				board:           board,
				row:             row,
				column:          column,
			}

			matches := wordsThatMatchPositions(cMatch)
			// result
			matches = filterMatchedWords(func(matchedWord MatchedWord) bool {
				return wordIsValidInBoard(matchedWord, board)
			})(matches)

			matches = mapMatched(func(matchedWord MatchedWord) MatchedWord {
				matchedWord.points = countPointsHelper(&matchedWord, board)
				return matchedWord
			})(matches)
		}
	}

	return result
}

func wordIsValidInBoard(matchedWord MatchedWord, board *Board) bool {
	return true
}

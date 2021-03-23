package main

import (
	"fmt"
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

type ColumnMatch struct {
	allWords        []string
	constructedWord string // Could be *be*apa  [][b][e][][a][p][a];
	playerChars     string
	board           *Board
	row             int
	column          int
}

func getConstructedWordFromBoard(board *Board, playerLength int, startRow int, column int) string {
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

func positionAfterCurrentWordIsEmpty(word string, columnMatch *ColumnMatch) bool {
	if columnMatch.row+len(word) < boardLength {
		if hasChar(columnMatch.board, columnMatch.row+len(word), columnMatch.column) {
			return false
		}
	}
	return true
}

func wordsThatMatchPositions(payload *ColumnMatch) []MatchedWord {
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

		constructedWord := getConstructedWordFromBoard(board, len(playerChars), row, column)

		if constructedWord != "" {
			cMatch := ColumnMatch{
				allWords:        lib.words,
				constructedWord: constructedWord,
				playerChars:     playerChars,
				board:           board,
				row:             row,
				column:          column,
			}

			matches := wordsThatMatchPositions(&cMatch)

			// result
			matches = filterMatchedWords(func(matchedWord MatchedWord) bool {
				return wordIsValidInBoard(&matchedWord, board)
			})(matches)

			matches = mapMatched(func(matchedWord MatchedWord) MatchedWord {
				matchedWord.points = countPointsHelper(&matchedWord, board)
				fmt.Println(matchedWord.points, matchedWord.word)
				return matchedWord
			})(matches)

			for i := 0; i < len(matches); i++ {
				result = append(result, matches[i])
			}
		}
	}

	return result
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

func countColumnPointsHelper(columnWord *MatchedWord, board *Board) int {
	setColumnWordInBoard(columnWord, board)

	points := countPoints(board)

	removeColumnWordFromBoard(columnWord, board)

	return points
}

func wordIsValidInBoard(columnWord *MatchedWord, board *Board) bool {
	setColumnWordInBoard(columnWord, board)

	isValid := board.isValid()

	removeColumnWordFromBoard(columnWord, board)

	return isValid
}

func solveColumns(board *Board, chars string) []MatchedWord {
	list := []MatchedWord{}

	for column := 0; column < boardLength; column++ {

		matcheds := solveColumn(chars, board, column)

		for i := 0; i < len(matcheds); i++ {
			list = append(list, matcheds[i])
		}
	}

	return list
}

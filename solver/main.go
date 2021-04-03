package solver

import (
	"fmt"
	"sync"
)

var library Library

func main() {
	fmt.Println("hejsanasjnajs")
}

func getWords(playerChars string, parseBoard string) []MatchedWord {
	library.openLibrary("english")

	var waitGroup sync.WaitGroup

	waitGroup.Add(2)
	var rowWords []MatchedWord
	var columnWords []MatchedWord
	rowBoard := getBoard(parseBoard)
	columnBoard := getBoard(parseBoard)

	go solveRow(&rowBoard, playerChars, &waitGroup, &rowWords)
	go solveColumn(&columnBoard, playerChars, &waitGroup, &columnWords)

	waitGroup.Wait()

	allWords := append(rowWords, columnWords...)
	sortByPoints(&allWords)
	if len(allWords) > 10 {
		allWords = allWords[0:10]
	}
	fmt.Println("allWords", allWords)
	return allWords
}

func getBoard(parseBoard string) Board {
	var board Board
	board.initializeBoard()
	board.parseRequest(parseBoard)
	return board
}

func solveRow(board *Board, playerChars string, wg *sync.WaitGroup, result *[]MatchedWord) {
	solver := Solver{
		board: board,
	}
	(*result) = solver.solve(playerChars, "row")

	(*result) = uniqueMatchedWords(result)
	wg.Done()
}

func solveColumn(board *Board, playerChars string, wg *sync.WaitGroup, result *[]MatchedWord) {
	solver := Solver{
		board: board,
	}
	(*result) = solver.solve(playerChars, "column")

	(*result) = uniqueMatchedWords(result)
	wg.Done()
}

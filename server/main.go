package main

import (
	"fmt"
	"sync"
)

var mainBoard Board
var solver Solver
var library Library

func main() {
	library.openLibrary("english")

	getBestWords(
		mainBoard,
		"asdfeg",
		"0,7,a;1,7,c;2,7,e;3,7,t;4,7,y;5,7,l;6,7,p;7,0,a;7,1,c;7,2,e;7,3,t;7,4,y;7,5,l;7,6,p;7,7,e;7,8,r;7,9,o;7,10,x;7,11,i;7,12,d;7,13,e;8,7,r;9,7,o;10,7,x;11,7,i;12,7,d;13,7,e;",
	)
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

func getBestWords(board Board, playerChars string, parseBoard string) {
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
}

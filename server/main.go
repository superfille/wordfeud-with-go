package main

import "fmt"

var library Library

var mainBoard Board
var solver Solver

// var rowSolver RowSolver

func main() {

}

func init() {
	// we have to open the library first
	library.openLibrary("english")

	mainBoard.initializeBoard()
	mainBoard.parseRequest("0,7,a;1,7,c;2,7,e;3,7,t;4,7,y;5,7,l;6,7,p;7,0,a;7,1,c;7,2,e;7,3,t;7,4,y;7,5,l;7,6,p;7,7,e;7,8,r;7,9,o;7,10,x;7,11,i;7,12,d;7,13,e;8,7,r;9,7,o;10,7,x;11,7,i;12,7,d;13,7,e;")

	solver := Solver{
		board: &mainBoard,
	}

	words := solver.solve("asdfeg", "column")
	words2 := solver.solve("asdfeg", "row")
	allWords := append(words, words2...)

	sortByPoints(&allWords)
	allWords = uniqueMatchedWords(&allWords)
	if len(allWords) > 10 {
		allWords = allWords[0:10]
	}
	fmt.Println("allWords", allWords)
	// mainBoard.printWithMatchedWord(&MatchedWord{
	// 	word: "frags", points: 35, hasNotFinalCharacter: false, row: 8, column: 6, direction: "row"})

	// mainBoard.printWithMatchedWord(&allWords[0])
	// bol := isWordFine("filip", "*ilip", "okfoe")

	// fmt.Println(bol)
}

package main

import "fmt"

var library Library

var mainBoard Board
var columnSolver ColumnSolver
var rowSolver RowSolver

// var rowSolver RowSolver

func main() {

}

func init() {
	// we have to open the library first
	library.openLibrary()

	mainBoard.initializeBoard()
	mainBoard.parseRequest("0,7,a;1,7,c;2,7,e;3,7,t;4,7,y;5,7,l;6,7,p;7,7,e;8,7,r;9,7,o;10,7,x;11,7,i;12,7,d;13,7,e;")
	columnSolver = ColumnSolver{
		board: mainBoard,
	}
	rowSolver = RowSolver{
		board: mainBoard,
	}
	words := columnSolver.solveColumns("asdfeg")
	words2 := rowSolver.solveRows("asdfeg")
	allWords := append(words, words2...)
	sortByPoints(allWords)
	allWords = allWords[0:10]
	fmt.Println("allWords", allWords)

	// bol := isWordFine("filip", "*ilip", "okfoe")

	// fmt.Println(bol)
}

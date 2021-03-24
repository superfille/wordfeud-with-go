package main

import (
	"fmt"
)

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
	mainBoard.parseRequest("6,9,c;7,8,p;7,9,o;7,10,o;7,11,p;8,9,r;9,9,n;")
	columnSolver = ColumnSolver{
		board: mainBoard,
	}
	rowSolver = RowSolver{
		board: mainBoard,
	}
	// words := columnSolver.solveColumns("abo")
	words := rowSolver.solveRows("erd")
	fmt.Println("words", words)

	// parseRequest("6,8,f;6,9,e;6,10,a;6,11,c;")
	// fmt.Println("Start server at 8080")
	// http.HandleFunc("/solve", solve)
	// http.ListenAndServe(":8080", nil)
}

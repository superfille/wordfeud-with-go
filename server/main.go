package main

import (
	"fmt"
)

var lib Library
var b Board

func main() {

}

func init() {
	// we have to open the library first
	lib.openLibrary()

	b.initializeBoard()
	b.parseRequest("6,10,c;7,9,p;7,10,o;7,11,o;7,12,p;8,10,r;9,10,n;")
	fmt.Println(b.tiles[6][10].c)
	points := solveColumns(&b, "abo")
	fmt.Println(points)

	// parseRequest("6,8,f;6,9,e;6,10,a;6,11,c;")
	// fmt.Println("Start server at 8080")
	// http.HandleFunc("/solve", solve)
	// http.ListenAndServe(":8080", nil)
}

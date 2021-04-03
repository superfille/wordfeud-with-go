package main

import (
	"wordfeud.com/solver"
)

func main() {
	solver.GetWords(
		"asdfeg",
		"0,7,a;1,7,c;2,7,e;3,7,t;4,7,y;5,7,l;6,7,p;7,0,a;7,1,c;7,2,e;7,3,t;7,4,y;7,5,l;7,6,p;7,7,e;7,8,r;7,9,o;7,10,x;7,11,i;7,12,d;7,13,e;8,7,r;9,7,o;10,7,x;11,7,i;12,7,d;13,7,e;",
	)
}

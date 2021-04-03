package solver

var allPoints [][]string = [][]string{
	/* 0 */ {},
	/* 1 */ {"a", "e", "i", "l", "n", "o", "r", "s", "t"},
	/* 2 */ {"d", "u"},
	/* 3 */ {"g", "m"},
	/* 4 */ {"b", "c", "f", "h", "p", "v", "w", "y"},
	/* 5 */ {"k"},
	/* 6 */ {},
	/* 7 */ {},
	/* 8 */ {"x"},
	/* 9 */ {},
	/*10 */ {"j", "q", "z"},
}

func getCharPoint(char string) int {
	for i := 0; i < len(allPoints); i++ {
		for v := 0; v < len(allPoints[i]); v++ {
			if allPoints[i][v] == char {
				return i
			}
		}
	}

	return -1
}

func countCharPoint(tile Tile, char string) int {
	if !tile.fixed {
		if "dl" == tile.s {
			return getCharPoint(char) * 2
		}
		if "tl" == tile.s {
			return getCharPoint(char) * 3
		}
	}
	return getCharPoint(char)
}

func countWordPoint(currentPoints int, tile Tile) int {
	if !tile.fixed {
		if tile.s == "dw" {
			points := currentPoints * 2
			return points
		}

		if tile.s == "tw" {
			points := currentPoints * 3
			return points
		}
	}

	return currentPoints
}

func countAllPoints(board *Board) int {
	column := countColumnPoints(board)
	row := countRowPoints(board)

	return column + row
}

package solver

func specialsColumn(currentPoints int, matchedWord MatchedWord, board *Board) int {
	points := currentPoints
	for i := 0; i < len(matchedWord.word); i++ {
		if matchedWord.row+i >= boardLength {
			break
		}
		points = countWordPoint(currentPoints, board.tiles[matchedWord.row+i][matchedWord.column])
	}

	return points
}

func columnPoints(matchedWord MatchedWord, board *Board) int {
	points := 0
	for i := 0; i < len(matchedWord.word); i++ {
		if matchedWord.row+i >= boardLength {
			break
		}
		points += countCharPoint(board.tiles[matchedWord.row+i][matchedWord.column], string(matchedWord.word[i]))
	}

	return specialsColumn(points, matchedWord, board)
}

func findColumnWords(board *Board) []MatchedWord {
	wordsFound := []MatchedWord{}

	for column := 0; column < boardLength; column++ {
		matchedWords := []MatchedWord{
			{
				word:                 "",
				points:               0,
				column:               column,
				row:                  -1,
				hasNotFinalCharacter: false,
			},
		}

		for row := 0; row < boardLength; row++ {
			if board.tiles[row][column].c == "" {
				if len(matchedWords[len(matchedWords)-1].word) > 0 {
					matchedWords = append(matchedWords, MatchedWord{
						word:                 "",
						points:               0,
						column:               column,
						row:                  -1,
						hasNotFinalCharacter: false,
					})
				}
			} else {
				if matchedWords[len(matchedWords)-1].row == -1 {
					matchedWords[len(matchedWords)-1].row = row
				}

				matchedWords[len(matchedWords)-1].word += board.tiles[row][column].c
				matchedWords[len(matchedWords)-1].hasNotFinalCharacter =
					matchedWords[len(matchedWords)-1].hasNotFinalCharacter || !board.tiles[row][column].fixed
			}
		}

		// Word has to be at least 2 characters and contain one character that is not final
		for i := 0; i < len(matchedWords); i++ {
			if len(matchedWords[i].word) > 1 && matchedWords[i].row >= 0 && matchedWords[i].hasNotFinalCharacter {
				wordsFound = append(wordsFound, matchedWords[i])
			}
		}
	}

	return wordsFound
}

func countColumnPoints(board *Board) int {
	wordsFound := findColumnWords(board)
	points := 0

	for i := 0; i < len(wordsFound); i++ {
		points += columnPoints(wordsFound[i], board)
	}

	return points
}

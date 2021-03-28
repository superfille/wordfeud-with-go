package main

func specialsRow(currentPoints int, matchedWord MatchedWord, board *Board) int {
	points := currentPoints
	for i := 0; i < len(matchedWord.word); i++ {
		if matchedWord.column+i >= boardLength {
			break
		}

		points = countWordPoint(currentPoints, board.tiles[matchedWord.row][matchedWord.column+i])
	}

	return points
}

func rowPoints(matchedWord MatchedWord, board *Board) int {
	points := 0
	for i := 0; i < len(matchedWord.word); i++ {
		if matchedWord.column+i >= boardLength {
			break
		}

		points += countCharPoint(board.tiles[matchedWord.row][matchedWord.column+i], string(matchedWord.word[i]))
	}

	return specialsRow(points, matchedWord, board)
}

func findRowWords(board *Board) []MatchedWord {
	wordsFound := []MatchedWord{}

	for row := 0; row < boardLength; row++ {
		matchedWords := []MatchedWord{
			{
				word:                 "",
				points:               0,
				column:               -1,
				row:                  row,
				hasNotFinalCharacter: false,
			},
		}

		for column := 0; column < boardLength; column++ {
			if board.tiles[row][column].c == "" {
				if len(matchedWords[len(matchedWords)-1].word) > 0 {
					matchedWords = append(matchedWords, MatchedWord{
						word:                 "",
						points:               0,
						column:               -1,
						row:                  row,
						hasNotFinalCharacter: false,
					})
				}
			} else {
				if matchedWords[len(matchedWords)-1].column == -1 {
					matchedWords[len(matchedWords)-1].column = column
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

func countRowPoints(board *Board) int {
	wordsFound := findRowWords(board)
	points := 0

	for i := 0; i < len(wordsFound); i++ {
		points += rowPoints(wordsFound[i], board)
	}

	return points
}

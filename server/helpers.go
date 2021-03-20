package main

func hasChar(board *Board, row int, column int) bool {
	return board.tiles[row][column].c != ""
}

func isWordFine(libraryWord string, constructedWord string, playerChars string) bool {
	return true
	// Get start of matching sequence of the constructedWord against the libraryWord
	// 	const libraryWordStartInConstructedWord = getStartOfMatchingSequence(libraryWord, constructedWord);
	// 	if (libraryWordStartInConstructedWord >= 0) {
	// 		// Check that the previous character in the constructedWord is a * or that we are at the beginning of the word
	// 		if (libraryWordStartInConstructedWord === 0 || constructedWord.split('')[libraryWordStartInConstructedWord - 1] === '*') {
	// 			// Get the missing characters we dont have in the constructedWord
	// 			const missingCharacters = getMissingCharacters(libraryWord, constructedWord, libraryWordStartInConstructedWord);
	// 			if (missingCharacters !== '') {
	// 				// check that the missing characters are in players characters list
	// 				if (missingCharactersInPlayerCharacters(missingCharacters, playerChars)) {
	// 					return true;
	// 				}
	// 		 }
	// 	 }
	//  }
	//  return false;
}

func countPointsHelper(matchedWord *MatchedWord, board *Board) int {
	return 2
}

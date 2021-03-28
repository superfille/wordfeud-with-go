package main

import (
	"sort"
	"strings"
)

func hasChar(board *Board, row int, column int) bool {
	return board.tiles[row][column].c != ""
}

func isWordFine(libraryWord string, constructedWord string, playerChars string) bool {
	// Get start of matching sequence of the constructedWord against the libraryWord
	libraryWordStartInConstructedWord := getStartOfMatchingSequence(libraryWord, constructedWord)
	if libraryWordStartInConstructedWord >= 0 {
		// Check that the previous character in the constructedWord is a * or that we are at the beginning of the word
		if libraryWordStartInConstructedWord == 0 || constructedWord[libraryWordStartInConstructedWord-1] == '*' {
			// Get the missing characters we dont have in the constructedWord
			missingCharacters := getMissingCharacters(libraryWord, constructedWord, libraryWordStartInConstructedWord)
			if missingCharacters != "" {
				// check that the missing characters are in players characters list
				if missingCharactersInPlayerCharacters(missingCharacters, playerChars) {
					return true
				}
			}
		}
	}
	return false
}

func getMissingCharacters(libraryWord string, constructedWord string, startInConstructedWord int) string {
	constructedWordSplitted := strings.Split(constructedWord, "")
	constructedWordSplitted = constructedWordSplitted[startInConstructedWord:]
	missingChars := ""

	for i := 0; i < len(constructedWordSplitted); i++ {
		if constructedWordSplitted[i] == "*" {
			if i < len(libraryWord) {
				missingChars += string(libraryWord[i])
			}
		}
	}

	return missingChars
}

func missingCharactersInPlayerCharacters(missing string, playerCharacters string) bool {
	temp := strings.Split(playerCharacters, "")
	missingSplit := strings.Split(missing, "")

	for i := 0; i < len(missingSplit); i++ {
		indexOf := -1
		for innerIndex := 0; innerIndex < len(temp); innerIndex++ {
			if temp[innerIndex] == missingSplit[i] {
				indexOf = innerIndex
				break
			}
		}
		if indexOf >= 0 {
			temp = removeIndex(temp, indexOf)
			continue
		}
		return false
	}
	return true
}

/**
* len(libraryWord) <= len(constructerWord)
 */
func getStartOfMatchingSequence(libraryWord string, constructedWord string) int {
	constructedWordSplitted := strings.Split(constructedWord, "")

	for index := -1; index < len(constructedWord); index++ {
		if index >= 0 {
			constructedWordSplitted = removeIndex(constructedWordSplitted, 0)
		}

		if sequenceMatch(libraryWord, strings.Join(constructedWordSplitted, "")) {
			if index == -1 {
				return 0
			}
			return index
		}
	}

	return -1
}

func sequenceMatch(libraryWord string, constructedWord string) bool {
	if len(libraryWord) > 0 && len(constructedWord) > 0 {
		if len(libraryWord) > len(constructedWord) {
			return false
		}

		librarySplitted := strings.Split(libraryWord, "")
		allTrue := true
		// Sequence matches algorithm
		for i := 0; i < len(librarySplitted); i++ {
			if constructedWord[i] == '*' || string(constructedWord[i]) == librarySplitted[i] {
			} else {
				allTrue = false
				break
			}
		}

		if allTrue {
			allCharactersShouldNotBeStars := []string{}
			for i := 0; i < len(librarySplitted); i++ {
				if constructedWord[i] == '*' || string(constructedWord[i]) == librarySplitted[i] {
					allCharactersShouldNotBeStars = append(allCharactersShouldNotBeStars, string(constructedWord[i]))
				}
			}

			for i := 0; i < len(allCharactersShouldNotBeStars); i++ {
				if allCharactersShouldNotBeStars[i] != "*" {
					return true
				}
			}
		}
	}
	return false
}

// func countPoints() int {
//   const column = columnS countColumnPoints(board)
//   const row = countRowPoints(board)

//   return column + row
// }

func sortByPoints(matchedWords []MatchedWordv2) {
	sort.SliceStable(matchedWords, func(i, j int) bool {
		return matchedWords[i].points > matchedWords[j].points
	})
}

func removeIndex(s []string, index int) []string {
	return append(s[:index], s[index+1:]...)
}

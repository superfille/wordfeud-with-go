import { MatchedWord, Tile } from "../Models/Tile";

const createArray = (total: number): Array<number> => {
  return Array.from(Array(total).keys())
}

const hasJokerAndRemoveJoker = (chars: Array<string>) => {
  const index = chars.indexOf('*')
  if (index >= 0) {
    chars.splice(index, 1)
    return true
  }
  return false
}

const matchedWordMatchesWord = (combinedChars: string, word: string) => {
  let copiedChars = combinedChars.split('')
  return word.split('').every((charInWord) => {
    const index = copiedChars.indexOf(charInWord)
    if (index >= 0) {
      copiedChars.splice(index, 1)
      return true
    } else {
      return hasJokerAndRemoveJoker(copiedChars)
    }
  });
}

const sortByPoints = (matchedWords: Array<MatchedWord>): Array<MatchedWord> => {
  return matchedWords.sort((a, b) => b.points - a.points)
}

/**
 * libraryWord matches constructedWord with constructedWord being able to contain *
 * which are all characters.
 * @param libraryWord 
 * @param constructedWord 
 */
const sequenceMatch = (libraryWord: string, constructedWord: string): boolean => {
  if (libraryWord.length > 0 && constructedWord.length > 0) {
    if (libraryWord.split('').every((char, index) => constructedWord[index] === '*' || char === constructedWord[index])) {
      const allCharactersShouldNotBeStars = libraryWord
        .split('')
        .reduce((prev, current, index) => {
          if (constructedWord[index] === '*' || current === constructedWord[index]) {
            return [...prev, constructedWord[index]];
          }
          return prev;
        }, [] as Array<string>);

      return allCharactersShouldNotBeStars.some(char => char !== '*');
    }
  }
  return false;
}

const getStartOfMatchingSequence = (libraryWord: string, constructedWord: string): number => {
  let index = 0;
  while (index < constructedWord.length) {
    if (sequenceMatch(libraryWord, constructedWord.slice(index))) {
      return index;
    }
    index++;
  }

  return -1;
}

const getMissingCharacters = (libraryWord: string, constructedWord: string, startInConstructedWord: number): string => {
  return constructedWord
    .split('')
    .slice(startInConstructedWord)
    .reduce((prev, current, index) => {
      // (libraryWordAsArray[index] || '') is needed if constructedWord is longer
      return current === '*' ? prev + (libraryWord[index] || '') : prev;
  }, '');
}

const missingCharactersInPlayerCharacters = (missing: string, playerCharacters: string): boolean => {
  let temp = playerCharacters.split('');
  return missing.split('').every(char => {
    const index = temp.indexOf(char);
    if (index >= 0) {
      temp.splice(index, 1);
      return true;
    }
    return false;
  })
}

const isWordFine = (libraryWord: string, constructedWord: string, playerChars: string):boolean => {
   // Get start of matching sequence of the constructedWord against the libraryWord
   const libraryWordStartInConstructedWord = getStartOfMatchingSequence(libraryWord, constructedWord);
   if (libraryWordStartInConstructedWord >= 0) {
     // Check that the previous character in the constructedWord is a * or that we are at the beginning of the word
     if (libraryWordStartInConstructedWord === 0 || constructedWord.split('')[libraryWordStartInConstructedWord - 1] === '*') {
       // Get the missing characters we dont have in the constructedWord
       const missingCharacters = getMissingCharacters(libraryWord, constructedWord, libraryWordStartInConstructedWord);
       if (missingCharacters !== '') {
         // check that the missing characters are in players characters list
         if (missingCharactersInPlayerCharacters(missingCharacters, playerChars)) {
           return true;
         }
      }
    }
  }
  return false;
}

const hasChar = (board: Array<Array<Tile>>, row: number, column: number): boolean => {
  return board[row][column].char !== '';
}

export {
  createArray,
  hasJokerAndRemoveJoker,
  sortByPoints,
  matchedWordMatchesWord,
  hasChar,
  sequenceMatch,
  getStartOfMatchingSequence,
  getMissingCharacters,
  missingCharactersInPlayerCharacters,
  isWordFine
}
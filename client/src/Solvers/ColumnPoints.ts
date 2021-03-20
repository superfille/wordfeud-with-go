import { MatchedWord, Tile } from "../Models/Tile";
import { countCharPoint, countWordPoint } from "./CountPoints";

const specials = (currentPoints: number, columnWord: MatchedWord, board: Array<Array<Tile>>) => {
  let points = currentPoints;
  for (let i = 0; i < columnWord.word.length; i++) {
    points = countWordPoint(currentPoints, board[columnWord.row + i][columnWord.column])
  }

  return points
}

const columnPoints = (matchedWord: MatchedWord, board: Array<Array<Tile>>): number => {
  let points = 0;
  for (let i = 0; i < matchedWord.word.length; i++) {
    points += countCharPoint(board[matchedWord.row + i][matchedWord.column], matchedWord.word[i]);
  }

  return specials(points, matchedWord, board);
}

const findColumnWords = (board: Array<Array<Tile>>): Array<MatchedWord> => {
  const wordsFound: Array<MatchedWord> = []

  for (let column = 0; column < board.length; column++) {
    const matchedWords: Array<MatchedWord> = [{
      word: '', points: 0, direction: 'column', column, row: -1, hasNotFinalCharacter: false,
    }];
    
    for (let row = 0; row < board.length; row++) {
      if (board[row][column].char === '') {
        if (matchedWords[matchedWords.length - 1].word.length > 0) {
          matchedWords.push({ word: '', points: 0, direction: 'column', column, row: -1, hasNotFinalCharacter: false })
        }
      } else {
        if (matchedWords[matchedWords.length - 1].row === -1) {
          matchedWords[matchedWords.length - 1].row = row;
        }

        matchedWords[matchedWords.length - 1].word += board[row][column].char;
        matchedWords[matchedWords.length - 1].hasNotFinalCharacter =
          matchedWords[matchedWords.length - 1].hasNotFinalCharacter || !board[row][column].final;
      }
    }
    // Word has to be at least 2 characters and contain one character that is not final
    wordsFound.push(...matchedWords.filter(matchedWord => matchedWord.word.length > 1 && matchedWord.hasNotFinalCharacter))
  }

  return wordsFound.filter(matchedWord => matchedWord.row >= 0)
}

const countColumnPoints = (board: Array<Array<Tile>>): number => {
  const wordsFound: Array<MatchedWord> = findColumnWords(board)
  return wordsFound.reduce((previous, current) => {
    return previous + columnPoints(current, board)
  }, 0);
}

export {
  countColumnPoints,
  findColumnWords,
}
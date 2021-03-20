import { MatchedWord, Tile } from "../Models/Tile";
import { countWordPoint, countCharPoint } from './CountPoints';

const specials = (currentPoints: number, rowWord: MatchedWord, board: Array<Array<Tile>>) => {
  let points = currentPoints;
  for (let i = 0; i < rowWord.word.length; i++) {
    points = countWordPoint(currentPoints, board[rowWord.row][rowWord.column + i])
  }

  return points
}

const rowPoints = (rowWord: MatchedWord, board: Array<Array<Tile>>): number => {
  let points = 0;
  for (let i = 0; i < rowWord.word.length; i++) {
    points += countCharPoint(board[rowWord.row][rowWord.column + i], rowWord.word[i]);
  }

  return specials(points, rowWord, board);
}

const findRowWords = (board: Array<Array<Tile>>): Array<MatchedWord> => {
  const wordsFound: Array<MatchedWord> = [];

  for (let row = 0; row < board.length; row++) {
    const matchedWords: Array<MatchedWord> = [{
      word: '', points: 0, direction: 'row', row, column: -1, hasNotFinalCharacter: false,
    }];

    for (let column = 0; column < board.length; column++) {
      if (board[row][column].char === '') {
        if (matchedWords[matchedWords.length - 1].word.length > 0) {
          matchedWords.push({ word: '', points: 0, direction: 'row', column: -1, row, hasNotFinalCharacter: false })
        }
      } else {
        if (matchedWords[matchedWords.length - 1].column === -1) {
          matchedWords[matchedWords.length - 1].column = column;
        }

        matchedWords[matchedWords.length - 1].word += board[row][column].char;
        matchedWords[matchedWords.length - 1].hasNotFinalCharacter =
          matchedWords[matchedWords.length - 1].hasNotFinalCharacter || !board[row][column].final;
      }
    }
    wordsFound.push(...matchedWords.filter(matchedWord => matchedWord.word.length > 1 && matchedWord.hasNotFinalCharacter))
  }

  return wordsFound;
}

const countRowPoints = (board: Array<Array<Tile>>) => {
  const wordsFound: Array<MatchedWord> = findRowWords(board)

  return wordsFound.reduce((previous, current) => {
    return previous + rowPoints(current, board)
  }, 0)
}

export {
  countRowPoints,
  findRowWords,
}
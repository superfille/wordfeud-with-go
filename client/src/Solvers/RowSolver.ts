import { boardIsValid } from '../Confirmers/Confirmer';
import { MatchedWord, Tile } from '../Models/Tile';
import { countPoints } from './CountPoints';
import { WordHandler } from '../Library/wordHandler';
import { hasChar, isWordFine } from './SolverUtil';

interface RowMatch {
  allWords: Array<string>;
  constructedWord: string;
  playerChars: string;
  board: Array<Array<Tile>>;
  row: number;
  column: number;
}

const getConstructedWordFromBoard = (payload: {
  board: Array<Array<Tile>>, start: number, playerCharsLength: number, row: number,
}): string => {
  let charsUsed = 0;
  let column = payload.start;
  let constructedWord: string = '';
  let index = 0;

  for (; column < payload.board.length; column++, index++) {
    if (hasChar(payload.board, payload.row, column)) {
      constructedWord += payload.board[payload.row][column].char;
      continue;
    }

    if (charsUsed < payload.playerCharsLength) {
      constructedWord += '*';
    }

    charsUsed += 1;
  
    if (column + 1 < payload.board.length && hasChar(payload.board, payload.row, column + 1)) {
      continue;
    }

    if (charsUsed >= payload.playerCharsLength) {
      break;
    }
  }

  const splitted = constructedWord.split('');
  if (splitted.some(c => c !== '*') && splitted.some(c => c === '*')) {
    return constructedWord;
  }

  return '';
}

const solve = (playerChars: string, board: Array<Array<Tile>>, row: number) => {
  const result: Array<MatchedWord> = [];
  
  for (let column = 0; column < board.length; column++) {
    if (column > 0 && hasChar(board, row, column - 1)) {
      // We start words when there is nothing to the left
      continue
    }

    const constructedWord: string = getConstructedWordFromBoard({
      board: board, start: column, row: row, playerCharsLength: playerChars.length
    });

    if (constructedWord !== '') {
      const matches = wordsThatMatchPositions({
        allWords: WordHandler.Instance.getWordsWithAtLeastLength(constructedWord.length),
        constructedWord: constructedWord,
        playerChars: playerChars,
        board: board,
        row,
        column
      })

      result.push(...matches
        .filter(rowWord => wordIsValidInBoard(rowWord, board))
        .map(matchedWord => {
          return {
            ...matchedWord,
            points: countPointsHelper(matchedWord, board)
          }
        }))
    }
  }

  return result
}

const positionAfterCurrentWordIsNotEmpty = (word: string, rowMatch: RowMatch): boolean => {
  if (rowMatch.column + word.length < rowMatch.board.length) {
    if (hasChar(rowMatch.board, rowMatch.row, rowMatch.column + word.length)) {
      return false;
    }
  }
  return true;
}

const wordsThatMatchPositions = (payload: RowMatch): Array<MatchedWord> => {
  return payload.allWords.reduce((accumulated, libraryWord) => {
    if (libraryWord.length <= 1 || libraryWord.length > payload.constructedWord.length) {
      return accumulated
    }

    if (!positionAfterCurrentWordIsNotEmpty(libraryWord, payload)) {
      return accumulated
    }

    if (isWordFine(libraryWord, payload.constructedWord, payload.playerChars)) {
      accumulated.push({
        word: libraryWord,
        direction: 'row',
        row: payload.row,
        column: payload.column,
        points: 0,
      });
    }

    return accumulated
  }, [] as Array<MatchedWord>)
}

const setWordInBoard = (rowWord: MatchedWord, board: Array<Array<Tile>>) => {
  try {
    for (let i = 0; i < rowWord.word.length; i++) {
      if (board[rowWord.row][rowWord.column + i].final === false) {
        board[rowWord.row][rowWord.column + i].char = rowWord.word[i];
      }
    }
  } catch (error) {
    console.log(rowWord)
    console.log(board[0][0])
    console.log(board[5][13])
    console.error(error)
  }
}

const removeWordFromBoard = (rowWord: MatchedWord, board: Array<Array<Tile>>) => {
  for (let i = 0; i < rowWord.word.length; i++) {
    if (board[rowWord.row][rowWord.column + i].final === false) {
      board[rowWord.row][rowWord.column + i].char = '';
    }
  }
}

const countPointsHelper = (rowWord: MatchedWord, board: Array<Array<Tile>>) => {
  setWordInBoard(rowWord, board);

  let points = countPoints(board);

  removeWordFromBoard(rowWord, board);

  return points;
}

const wordIsValidInBoard = (rowWord: MatchedWord, board: Array<Array<Tile>>) => {
  setWordInBoard(rowWord, board);

  const isValid = boardIsValid(board);

  removeWordFromBoard(rowWord, board);

  return isValid;
}

const solveRows = (board: Array<Array<Tile>>, chars: string): Array<MatchedWord> => {
  const list: Array<MatchedWord> = [];

  for (let row = 0; row < board.length; row++) {
    list.push(...solve(chars, board, row));
  }

  return list;
}

export {
  solveRows
}
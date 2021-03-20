import { MatchedWord, Tile } from "../Models/Tile";
import { boardIsValid } from "../Confirmers/Confirmer";
import { hasChar, isWordFine } from './SolverUtil';
import { countPoints } from "./CountPoints";
import { WordHandler } from "../Library/wordHandler";

export interface ColumnMatch {
  allWords: Array<string>;
  constructedWord: string; // Could be *be*apa  [][b][e][][a][p][a];
  playerChars: string;
  board: Array<Array<Tile>>;
  row: number;
  column: number;
}

/**
 * Find the word position in the board.
 * And get position of the characters in the board
 * If we have start: 1
 * and board:
 * [][a][][b][c][]
 * and playerCharsLength: 2 // user has 2 characters
 * we will get
 * constructedWord: a*bc*
 * maxLength: 5 // we start at a and can only go to after b because the board ends
 * @param payload
 */
const getConstructedWordFromBoard = (payload: {
  board: Array<Array<Tile>>, start: number, playerCharsLength: number, column: number
}): string => {
  let charsUsed = 0;
  let row = payload.start;
  let constructedWord: string = '';
  let index = 0;

  for (; row < payload.board.length; row++, index++) {
    if (hasChar(payload.board, row, payload.column)) {
      constructedWord += payload.board[row][payload.column].char;
      continue;
    }
  
    if (charsUsed < payload.playerCharsLength) {
      constructedWord += '*';
    }
  
    charsUsed += 1;

    // The next tile is not the end of the board and is not empty, we can continue
    if (row + 1 < payload.board.length && hasChar(payload.board, row + 1, payload.column)) {
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

/**
 * Make sure that the word we create doesn't have a char after it. Which makes it not a word then
 * possibly. If it is a word, it will probably be checked at a later point from the allWord array.
 * @param word The word we get from lexikon
 * @param columnMatch the board, which column we are in and from where the word starts
 */
const positionAfterCurrentWordIsEmpty = (word: string, columnMatch: ColumnMatch): boolean => {
  if (columnMatch.row + word.length < columnMatch.board.length) {
    if (hasChar(columnMatch.board, columnMatch.row + word.length, columnMatch.column)) {
      return false;
    }
  }
  return true;
}

const wordsThatMatchPositions = (payload: ColumnMatch): Array<MatchedWord> => {
  return payload.allWords.reduce((accumulated, libraryWord) => {
    if (libraryWord.length <= 1 || libraryWord.length > payload.constructedWord.length) {
      return accumulated
    }


    if (!positionAfterCurrentWordIsEmpty(libraryWord, payload)) {
      return accumulated
    }

    if (isWordFine(libraryWord, payload.constructedWord, payload.playerChars)) {
        accumulated.push({
          word: libraryWord,
          direction: 'column',
          row: payload.row,
          column: payload.column,
          points: 0,
        })
      }

    return accumulated
  }, [] as Array<MatchedWord>);
}

/**
 * @param playerChars 
 * @param board 
 * @param column 
 */
const solve = (playerChars: string, board: Array<Array<Tile>>, column: number) => {
  const result: Array<MatchedWord> = [];
  
  for (let row = 0; row < board.length; row++) {
    if (row > 0 && hasChar(board, row - 1, column)) {
      // We start words when there is nothing above
      continue
    }

    const constructedWord: string = getConstructedWordFromBoard({
      board, start: row, column, playerCharsLength: playerChars.length
    })

    if (constructedWord !== '') {
      const matches = wordsThatMatchPositions({
        allWords: WordHandler.Instance.getWordsWithAtLeastLength(constructedWord.length),
        constructedWord: constructedWord,
        playerChars: playerChars,
        board: board,
        row,
        column
      });

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

const setWordInBoard = (columnWord: MatchedWord, board: Array<Array<Tile>>) => {
  for (let i = 0; i < columnWord.word.length; i++) {
    if (board[columnWord.row + i][columnWord.column].final === false) {
      board[columnWord.row + i][columnWord.column].char = columnWord.word[i];
    }
  }
}

const removeWordFromBoard = (columnWord: MatchedWord, board: Array<Array<Tile>>) => {
  for (let i = 0; i < columnWord.word.length; i++) {
    if (board[columnWord.row + i][columnWord.column].final === false) {
      board[columnWord.row + i][columnWord.column].char = '';
    }
  }
}

const countPointsHelper = (columnWord: MatchedWord, board: Array<Array<Tile>>): number => {
  setWordInBoard(columnWord, board);

  let points = countPoints(board);

  removeWordFromBoard(columnWord, board);

  return points;
}

const wordIsValidInBoard = (columnWord: MatchedWord, board: Array<Array<Tile>>) => {
  setWordInBoard(columnWord, board);

  const isValid = boardIsValid(board);

  removeWordFromBoard(columnWord, board);

  return isValid;
}

const solveColumns = (board: Array<Array<Tile>>, chars: string): Array<MatchedWord> => {
  const list: Array<MatchedWord> = []

  for (let column = 0; column < board.length; column++) {
    list.push(...solve(chars, board, column))
  }

  return list;
}


export {
  solveColumns,
  getConstructedWordFromBoard,
  positionAfterCurrentWordIsEmpty
}
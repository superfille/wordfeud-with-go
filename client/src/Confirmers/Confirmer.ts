import { Tile, Position } from '../Models/Tile';
import englishWords from '../Words.json';

const words: Array<string> = englishWords as Array<string>;

const isStartOfHorizontalWord = (row: number, column: number, board: Array<Array<Tile>>) => {
  // No char in this tile
  if (board[row][column].char === '') {
    return false;
  }

  // At the start of the board and tile to right is a char
  if (column === 0) {
    if (board[row][column + 1].char !== '') {
      return true;
    }
    return false;
  }

  // At the end of the board
  if (column === board[0].length - 1) {
    return false;
  }

  // Somewhere in the board where there is no char to the left but one to the right
  if (board[row][column - 1].char === '' && board[row][column + 1].char !== '') {
    return true;
  }

  return false;
}

const isStartOfVerticalWord = (row: number, column: number, board: Array<Array<Tile>>) => {
    // No char in this tile
    if (board[row][column].char === '') {
      return false;
    }

  // At the start of the board and a char is beneath this tile
  if (row === 0) {
    if (board[row + 1][column].char !== '') {
      return true
    }
    return false;
  }

  // At the end of the board
  if (row === board[0].length - 1) {
    return false;
  }

  // Somewhere in the board where there is no char above but there is one beneath
  if (board[row - 1][column].char === '' && board[row + 1][column].char !== '') {
    return true;
  }

  return false;
}

/**
 * Do this after we know that this tile is the start of horizontal word
 */
const getHorizontalWord = (row: number, column: number, board: Array<Array<Tile>>) => {
  let lastColumnOfWord = column;
  let word = '';

  while (lastColumnOfWord < board[0].length && board[row][lastColumnOfWord].char !== '') {
    word += board[row][lastColumnOfWord].char;
    lastColumnOfWord += 1;
  }

  return word;
}

/**
 * Do this after we know that this tile is the start of vertical word
 */
const getVerticalWord = (row: number, column: number, board: Array<Array<Tile>>) => {
  let lastRowOfWord = row;
  let word = '';

  while (lastRowOfWord < board[0].length && board[lastRowOfWord][column].char !== '') {
    word += board[lastRowOfWord][column].char;
    lastRowOfWord += 1;
    if (lastRowOfWord > 100) {
      break;
    }
  }

  return word;
}

const canGoLeft = (row: number, column: number, board: Array<Array<Tile>>) => {
  return column - 1 > 0 && board[row][column - 1].char !== '';
}

const canGoRight = (row: number, column: number, board: Array<Array<Tile>>) => {
  return column + 1 < board.length && board[row][column + 1].char !== '';
}

const canGoUp = (row: number, column: number, board: Array<Array<Tile>>) => {
  return row - 1 > 0 && board[row - 1][column].char !== '';
}

const canGoDown = (row: number, column: number, board: Array<Array<Tile>>) => {
  return row + 1 < board.length && board[row + 1][column].char !== '';
}

const totalNumberOfCharsInBoard = (board: Array<Array<Tile>>) => {
  let count = 0;
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column].char !== '') {
        count += 1;
      }
    }
  }
  return count;
}

const hasVisited = (row: number, column: number, visited: Array<Position>) => {
  return visited.some(visit => visit.row === row && visit.column === column)
}

const searchLabyrint = (row: number, column: number, board: Array<Array<Tile>>, visited: Array<Position>, count: number) => {
  if (canGoRight(row, column, board) && !hasVisited(row, column + 1, visited)) {
    visited.push({ row: row, column: column + 1 })
    count = searchLabyrint(row, column + 1, board, visited, count + 1)
  }

  if (canGoUp(row, column, board) && !hasVisited(row - 1, column, visited)) {
    visited.push({ row: row - 1, column: column })
    count = searchLabyrint(row - 1, column, board, visited, count + 1)
  }

  if (canGoDown(row, column, board) && !hasVisited(row + 1, column, visited)) {
    visited.push({ row: row + 1, column: column })
    count = searchLabyrint(row + 1, column, board, visited, count + 1)
  }

  if (canGoLeft(row, column, board) && !hasVisited(row, column - 1, visited)) {
    visited.push({ row: row, column: column - 1 })
    count = searchLabyrint(row, column - 1, board, visited, count + 1)
  }

  return count
}

const wordsAreConnected = (board: Array<Array<Tile>>) => {
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      if (board[row][column].char !== '') {
        return searchLabyrint(row, column, board, [{row, column}], 1) === totalNumberOfCharsInBoard(board)
      }
    }
  }
  return true;
}

const isWord = (word: string) => {
  return words.some(item => item === word);
}

/**
 * Returns list of invalid words
 */
const boardIsValid = (board: Array<Array<Tile>>) => {
  if (!wordsAreConnected(board)) {
    return false;
  }

  const invalidWords = [];
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      if (isStartOfHorizontalWord(row, column, board)) {
        const word = getHorizontalWord(row, column, board)
        if (!isWord(word)) {
          invalidWords.push(word)
        }
      }

      if (isStartOfVerticalWord(row, column, board)) {
        const word = getVerticalWord(row, column, board)
        
        if (!isWord(word)) {
          invalidWords.push(word)
        }
      }
    }
  }
  
  return invalidWords.length === 0;
}




export {
  isStartOfHorizontalWord,
  isStartOfVerticalWord,
  getHorizontalWord,
  getVerticalWord,
  boardIsValid,
  wordsAreConnected,
}
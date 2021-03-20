import { NewTile, StartBoard, Tile } from "../Models/Tile";

const createBoard = (board: Array<Array<Tile>>, final: boolean, getChar: (row: number, column: number) => string): Array<Array<Tile>> => {
  return board.map((row, indexRow) => {
    return row.map((column, indexColumn) => {
      const char = getChar(indexRow, indexColumn);
      if (char) {
        return {
          final: final,
          char: char,
          special: column.special,
          playerChar: true,
        };
      }
      return { ...column, playerChar: false };
    });
  });
}


const createLocalStorageBoard = (board: Array<Array<Tile>>, final: boolean, getChar: (row: number, column: number) => string): Array<Array<Tile>> => {
  return board.map((row, indexRow) => {
    return row.map((column, indexColumn) => {
      const char = getChar(indexRow, indexColumn);
      if (char) {
        return {
          final: final,
          char: char,
          special: column.special,
          playerChar: false,
        };
      }
      return { ...column };
    });
  });
}

export const save = (boardName: string, board: Array<Array<Tile>>) => {
  let newSave = '';
  for(let row = 0; row < board.length; row++) {
    for(let column = 0; column < board.length; column++) {
      if (board[row][column].final) {
        newSave += `${row},${column},${board[row][column].char};`
      }
    }
  }
  window.localStorage.setItem(boardName, newSave);
}

export const read = (boardName: string): Array<Array<Tile>> => {
  const localBoard = window.localStorage.getItem(boardName);
  if (!localBoard) {
    return StartBoard;
  }
  
  const savedBoard = localBoard.split(';').map(item => item.split(','));
  const getChar = (row: number, column: number) => {
    const savedTile = savedBoard.find(item => Number(item[0]) === row && Number(item[1]) === column);
    return savedTile ? savedTile[2] : '';
  }

  return createLocalStorageBoard(StartBoard, true, getChar);
}

/**
 * Removes all non final characters from the current state board
 * @param func 
 */
export const cleanBoard = (board: Array<Array<Tile>>) => {
  return board.map(row => {
    return row.map(tile => {
        return { ...tile, char: tile.final ? tile.char : '' }
    })
  });
}

export const setAllToFinal = (board: Array<Array<Tile>>) => {
  return board.map(row => {
    return row.map(tile => {
        return { ...tile, final: tile.final || !!tile.playerChar, playerChar: false }
    })
  });
}

export const readLocalStorageBoards = (): Array<{name: string; board: string; }> => {
  const boards: Array<{ name: string, board: string }> = [];

  for(let i = 0; i < window.localStorage.length; i++) {
    if (window.localStorage.key(i)) {
      boards.push({
        name: window.localStorage.key(i) || '',
        board: window.localStorage.getItem(window.localStorage.key(i) || '') || ''
      });
    }
  }

  return boards;
}

export const deleteBoard = (boardName: string): string => {
  const boardExists = window.localStorage.getItem(boardName);
  if (boardExists !== null) {
    window.localStorage.removeItem(boardName);
    return `Removed board ${boardName}`;
  }

  return 'No board with that name';
}

export const setNewTilesToBoard = (newTiles: Array<NewTile>, board: Array<Array<Tile>>) => {
  const getChar = (row: number, column: number) => {
    const tile = newTiles.find(tile => tile.row === row && tile.column === column);

    return !tile || tile.char === 'Backspace' ? '' : tile.char;
  }

  return createBoard(board, false, getChar);
}

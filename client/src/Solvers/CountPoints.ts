import { CharacterPoints, Tile } from "../Models/Tile"
import { countColumnPoints } from "./ColumnPoints"
import { countRowPoints } from "./RowPoints"

const getCharPoint = (char: string) => {
  return CharacterPoints.findIndex(cList => cList.includes(char))
}

const countCharPoint = (tile: Tile, char: string) => {
  if (!tile.final) {
    if ('dl' === tile.special) {
      return getCharPoint(char) * 2
    }
    if ('tl' === tile.special) {
      return getCharPoint(char) * 3
    }
  }

  return getCharPoint(char)
}

const countWordPoint = (currentPoints: number, tile: Tile): number => {
  if (!tile.final) {
    if (tile.special === 'dw') {
      return currentPoints *= 2;
    }
  
    if (tile.special === 'tw') {
      return currentPoints *= 3;
    } 
  }

  return currentPoints
}

const countPoints = (board: Array<Array<Tile>>): number => {
  const column = countColumnPoints(board)
  const row = countRowPoints(board)

  return column + row
}

export {
  countCharPoint,
  countWordPoint,
  countPoints
}
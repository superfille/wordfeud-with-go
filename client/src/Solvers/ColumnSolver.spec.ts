/**
 *  
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
 */

import { finalTile, Tile } from "../Models/Tile"
import { getConstructedWordFromBoard, ColumnMatch, positionAfterCurrentWordIsEmpty } from "./ColumnSolver"

// @ts-ignore
describe('ColumnSolver', () => {
  describe('getConstructedWordFromBoard', () => {
    it('should get correct positions when starting at the beginning of board', () => {
      const board: Array<Array<Tile>> = [
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile('p'), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      ]
      const start = 0;
      const playerCharsLength = 2;
      const column = 1;

      const result: string = getConstructedWordFromBoard({ board, start, playerCharsLength, column })

      expect(result).toEqual('*ap*');
    })

    it('should get correct positions when starting inside the board', () => {
      const board: Array<Array<Tile>> = [
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile('p'), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      ]
      const start = 2;
      const playerCharsLength = 2;
      const column = 1;

      const result: string = getConstructedWordFromBoard({ board, start, playerCharsLength, column })

      expect(result).toEqual('pa*');
    })

    it('should get empty', () => {
      const board: Array<Array<Tile>> = [
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      ]
      const start = 0;
      const playerCharsLength = 2;
      const column = 1;

      const result: string = getConstructedWordFromBoard({ board, start, playerCharsLength, column })

      expect(result).toEqual('');
    })
  })

  describe('positionAfterCurrentWordIsEmpty', () => {
    it('should return false because the word has another char after last char', () => {
      const columMatch = {
        board: [
          [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile('f'), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        ],
        row: 0,
        column: 1,
      } as ColumnMatch;
      const word = 'apa';

      const result = positionAfterCurrentWordIsEmpty(word, columMatch)

      expect(result).toBeFalsy();
    });

    it('should return false because the word has another char after last char 2', () => {
      const columMatch = {
        board: [
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile('f'), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        ],
        row: 1,
        column: 1,
      } as ColumnMatch;
      const word = 'apa';

      const result = positionAfterCurrentWordIsEmpty(word, columMatch)

      expect(result).toBeFalsy();
    });

    it('should return true because the word does not have another char after last char', () => {
      const columMatch = {
        board: [
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        ],
        row: 1,
        column: 1,
      } as ColumnMatch;
      const word = 'apa';

      const result = positionAfterCurrentWordIsEmpty(word, columMatch)

      expect(result).toBeTruthy();
    });

    it('should return false because the word ends at board end', () => {
      const columMatch = {
        board: [
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
          [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
        ],
        row: 2,
        column: 1,
      } as ColumnMatch;
      const word = 'apa';

      const result = positionAfterCurrentWordIsEmpty(word, columMatch)

      expect(result).toBeTruthy();
    });
  })


})
import { finalTile, notFinalTile, Tile } from '../Models/Tile';
import { findRowWords } from './RowPoints';

/**
 *  
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
 */

// @ts-ignore
describe('RowPoint findRowWords function', () => {
  it('should find word when it is at the top of the board', () => {
    const board: Array<Array<Tile>> = [
      [finalTile('a'), finalTile('p'), notFinalTile('a'), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    ];

    const result = findRowWords(board);

    expect(result[0].word).toBe('apa')
  })

  it('should find word when it is at the bottom of the board', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile('a'), finalTile('p'), notFinalTile('a'), finalTile(), finalTile()],
    ];

    const result = findRowWords(board);

    expect(result[0].word).toBe('apa')
  })

  it('should find word when it ends at the last column', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile('a'), finalTile('p'), notFinalTile('a')],
    ];

    const result = findRowWords(board);

    expect(result[0].word).toBe('apa')
  })

  it('should find word two words in a row', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [notFinalTile('a'), finalTile('p'), finalTile(), finalTile('p'), notFinalTile('a')],
    ];

    const result = findRowWords(board);

    expect(result.length).toBe(2)
  })

  it('should find word one word that is not final in a row with two words', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile('a'), finalTile('p'), finalTile(), finalTile('p'), notFinalTile('a')],
    ];

    const result = findRowWords(board);

    expect(result.length).toBe(1)
  })
})
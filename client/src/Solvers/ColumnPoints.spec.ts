import { finalTile, notFinalTile, Tile } from '../Models/Tile';
import { findColumnWords } from './ColumnPoints';

/**
 *  
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
 */

// @ts-ignore
describe('ColumnPoints findColumnWords function', () => {
  it('should find word when it begins at the top of the board', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
      [finalTile(), notFinalTile('p'), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
    ];

    const result = findColumnWords(board)

    expect(result[0].word).toBe('apa')
  })

  it('should find word when it ends at the bottom of the board', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile('a'), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile('p'), finalTile(), finalTile(), finalTile()],
      [finalTile(), notFinalTile('a'), finalTile(), finalTile(), finalTile()],
    ];

    const result = findColumnWords(board)

    expect(result[0].word).toBe('apa')
  })

  it('should count one word with two words next to it ', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(),       finalTile(), finalTile(), finalTile()],
      [finalTile('b'), finalTile(),       finalTile('b'), finalTile(), finalTile()],
      [finalTile('e'), finalTile('a'),    finalTile('e'), finalTile(), finalTile()],
      [finalTile('p'), finalTile('p'),    finalTile('p'), finalTile(), finalTile()],
      [finalTile('a'), notFinalTile('a'), finalTile('a'), finalTile(), finalTile()],
    ];

    const result = findColumnWords(board)

    expect(result[0].word).toBe('apa')
    expect(result.length).toEqual(1)
  })

  it('should count no words because there are not column words with more than 1 character ', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), notFinalTile('a'), finalTile('p'), notFinalTile('b'), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), notFinalTile('h'), finalTile('e'), finalTile('j')],
    ];

    const result = findColumnWords(board)

    expect(result.length).toEqual(0)
  })

  it('should find two words in same column ', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), notFinalTile('a'), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile('b'), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile('q'), finalTile(), finalTile()],
      [finalTile(), finalTile(), notFinalTile('e'), finalTile(), finalTile()],
    ];

    const result = findColumnWords(board)

    expect(result.length).toEqual(2)
  })

  it('should find one word in column even though there are more words in column ', () => {
    const board: Array<Array<Tile>> = [
      [finalTile(), finalTile(), finalTile('a'), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile('b'), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile(), finalTile(), finalTile()],
      [finalTile(), finalTile(), finalTile('q'), finalTile(), finalTile()],
      [finalTile(), finalTile(), notFinalTile('e'), finalTile(), finalTile()],
    ];

    const result = findColumnWords(board)

    expect(result.length).toEqual(1)
  })
})
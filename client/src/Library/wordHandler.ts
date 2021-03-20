import englishWords_2 from './English/englishWords_2.json';
import englishWords_3 from './English/englishWords_3.json';
import englishWords_4 from './English/englishWords_4.json';
import englishWords_5 from './English/englishWords_5.json';
import englishWords_6 from './English/englishWords_6.json';
import englishWords_7 from './English/englishWords_7.json';
import englishWords_8 from './English/englishWords_8.json';
import englishWords_9 from './English/englishWords_9.json';
import englishWords_10 from './English/englishWords_10.json';
import englishWords_11 from './English/englishWords_11.json';
import englishWords_12 from './English/englishWords_12.json';
import englishWords_13 from './English/englishWords_13.json';
import englishWords_14 from './English/englishWords_14.json';
import englishWords_15 from './English/englishWords_15.json';
import englishWords_16 from './English/englishWords_16.json';
import englishWords_17 from './English/englishWords_17.json';
import englishWords_18 from './English/englishWords_18.json';
import englishWords_19 from './English/englishWords_19.json';
import englishWords_20 from './English/englishWords_20.json';
import englishWords_21 from './English/englishWords_21.json';
import englishWords_22 from './English/englishWords_22.json';
import englishWords_23 from './English/englishWords_23.json';
import englishWords_24 from './English/englishWords_24.json';
import englishWords_25 from './English/englishWords_25.json';

export class WordHandler {
  private static _instance: WordHandler;
  private _words: Array<Array<string>> = [];

  private constructor() {
    this._words = [
      englishWords_2,
      englishWords_3,
      englishWords_4,
      englishWords_5,
      englishWords_6,
      englishWords_7,
      englishWords_8,
      englishWords_9,
      englishWords_10,
      englishWords_11,
      englishWords_12,
      englishWords_13,
      englishWords_14,
      englishWords_15,
      englishWords_16,
      englishWords_17,
      englishWords_18,
      englishWords_19,
      englishWords_20,
      englishWords_21,
      englishWords_22,
      englishWords_23,
      englishWords_24,
      englishWords_25,
    ]
  }

  public static get Instance() {
      return this._instance || (this._instance = new this());
  }

  getWordsWithAtLeastLength = (length: number): Array<string> => {
    if (length < 2 || length > 25) {
      return [];
    }

    const result = this._words
    .filter(monkey => monkey[0].length <= length)
    .flat(1);

    return result;
  }
}
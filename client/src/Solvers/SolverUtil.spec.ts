import { getStartOfMatchingSequence, sequenceMatch } from "./SolverUtil";

// @ts-ignore
describe('Solver util', () => {
  describe('sequenceMatch', () => {
    it('should match 1', () => {
      const word1 = 'ear';
      const word2 = '*ar';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeTruthy();
    });

    it('should match 2', () => {
      const word1 = 'ear';
      const word2 = 'ear*';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeTruthy();
    });

    it('should match 3', () => {
      const word1 = 'ear';
      const word2 = 'e*r';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeTruthy();
    });

    it('should not match 1', () => {
      const word1 = 'ear';
      const word2 = 'aer';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeFalsy();
    });

    it('should not match 2', () => {
      const word1 = 'ear';
      const word2 = '**ear';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeFalsy();
    });

    it('should not match 3', () => {
      const word1 = 'ear';
      const word2 = '**a';
      const result = sequenceMatch(word1, word2);

      expect(result).toBeFalsy();
    });
  });

  describe('getStartOfMatchingSequence', () => {
    it('should be able to get correct match at position 1 on constructed word', () => {
      const libraryWord = 'tear';
      const constructedWord = '**ear';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(1);
    });

    it('should be able to get correct match at position 1 on constructed word', () => {
      const libraryWord = 'tear';
      const constructedWord = '****r';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(1);
    });

    it('should be able to get correct match at position 0 on constructed word', () => {
      const libraryWord = 'tear';
      const constructedWord = 't***';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(0);
    });

    it('should be able to get correct match at position 1 on constructed word', () => {
      const libraryWord = 'tear';
      const constructedWord = 'tt***';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(1);
    });

    it('should be not find match 1', () => {
      const libraryWord = 'tear';
      const constructedWord = 'tt**';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(-1);
    });

    it('should be not find match 2', () => {
      const libraryWord = 'tear';
      const constructedWord = 't**';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(-1);
    });

    it('should be not find match 3', () => {
      const libraryWord = 'tear';
      const constructedWord = '**a';
  
      const result = getStartOfMatchingSequence(libraryWord, constructedWord);
  
      expect(result).toBe(-1);
    });
  });
});
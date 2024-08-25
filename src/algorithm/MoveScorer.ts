export class MoveScorer {
  // For now, just track the score in the UI
  private totalScore: number;
  private totalWords: number;

  constructor() {
    this.totalScore = 0;
    this.totalWords = 0;
  }

  public scoreWord(validWord: string): number {
    const length = validWord.length;
    if (length < 2) {
      return 0;
    } else if (length === 3 || length === 4) {
      return 1;
    } else if (length === 5) {
      return 2;
    } else if (length === 6) {
      return 3;
    } else if (length === 7) {
      return 5;
    } else {
      return 8;
    }
  }

  public getScore() {
    return this.totalScore;
  }

  public getWords() {
    return this.totalWords;
  }
}
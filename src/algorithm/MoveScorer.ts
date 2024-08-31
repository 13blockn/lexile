export class MoveScorer {
  // For now, just track the score in the UI
  private totalScore: number;
  private totalWords: number;

  constructor() {
    this.totalScore = 0;
    this.totalWords = 0;
  }

  public scoreWord(validWord: string): number {
    this.totalWords++;
    const length = validWord.length;
    if (length < 2) {
      return 0;
    } else if (length === 3 || length === 4) {
      this.totalScore += 1;
      return 1;
    } else if (length === 5) {
      this.totalScore += 2;
      return 2;
    } else if (length === 6) {
      this.totalScore += 3;
      return 3;
    } else if (length === 7) {
      this.totalScore += 5;
      return 5;
    } else {
      this.totalScore += 8;
      return 8;
    }
  }

  public getScore() {
    return this.totalScore;
  }

  public getWords() {
    return this.totalWords;
  }

  public getRank(solutionScore: number): string {
    if (this.totalScore >= solutionScore) {
      return "Cheater";
    } else if (this.totalScore >= 0.4 * solutionScore) {
      return "Savant";
    } else if (this.totalScore >= 0.2 * solutionScore) {
      return "Master";
    } else if (this.totalScore >= 0.1 * solutionScore) {
      return "Brilliant";
    } else if (this.totalScore >= 0.05 * solutionScore) {
      return "Clever";
    } else if (this.totalScore >= 0.03 * solutionScore) {
      return "Good";
    } else if (this.totalScore >= 0.02 * solutionScore) {
      return "Solid";
    } else if (this.totalScore >= 0.01 * solutionScore) {
      return "Novice";
    } else {
      return "Ope";
    }
  }
}

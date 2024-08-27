import { Die } from "../models/Die";

export class LetterShuffler {
  private shuffledBoard: string[][]; // This is brittle, I want fixed length string
  private boardSize: number;

  constructor(boardSize: number) {
    this.shuffledBoard = [];
    for (let i = 0; i < boardSize; i++) {
      this.shuffledBoard.push([]);
      for (let j = 0; j < boardSize; j++) {
        this.shuffledBoard[i].push("A"); // This wants to be filled during the shuffle method
      }
    }
    this.boardSize = boardSize;
  }

  public shuffle() {
    const dice: Die[] = Die.getDice(this.boardSize);

    const shuffledDice: Die[] = this.shuffleDice(dice);

    let i = 0;
    for (const die of shuffledDice) {
      const letter = this.chooseLetter(die);
      this.setCharacter(i, letter);
      i++;
    }

    return this.shuffledBoard;
  }

  public dailyShuffle() {
    const now = new Date();
    // Create a seed from the date (e.g., YYYYMMDD format)
    const seed = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const dice: Die[] = Die.getDice(this.boardSize);

    const shuffledDice: Die[] = this.shuffleDice(dice, seed);

    let i = 0;
    for (const die of shuffledDice) {
      const letter = this.chooseLetter(die, seed);
      this.setCharacter(i, letter);
      i++;
    }

    return this.shuffledBoard;
  }

  // Copied from internet
  shuffleDice(array: Die[], seed?: string): Die[] {
    let randomFn: () => number;

    if (seed) {
      randomFn = this.seededPRNG(seed);
    } else {
      randomFn = Math.random;
    }
    const shuffled = [...array];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  private seededPRNG(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }

    return function () {
      h = (h * 1664525 + 1013904223) % 4294967296;
      return (h >>> 0) / 4294967296;
    };
  }

  private chooseLetter(die: Die, seed?: string) {
    let randomFn: () => number;

    if (seed) {
      randomFn = this.seededPRNG(seed);
    } else {
      randomFn = Math.random;
    }
    return die.getCharacter(Math.floor(randomFn() * Die.SIDES));
  }

  private setCharacter(index: number, letter: string) {
    const column = index % this.boardSize;
    const row = Math.floor(index / this.boardSize);
    this.shuffledBoard[row][column] = letter;
  }
}

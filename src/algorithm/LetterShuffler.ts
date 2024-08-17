import { Die } from '../models/Die';

export class LetterShuffler {
  private shuffledBoard: string[][]; // This is brittle, I want fixed length string
  private boardSize: number;

  constructor(boardSize: number) {
    this.shuffledBoard = [];
    for (let i = 0; i < boardSize; i++) {
      this.shuffledBoard.push([]);
      for (let j = 0; j < boardSize; j++) {
        this.shuffledBoard[i].push('A'); // This wants to be filled during the shuffle method
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

  // Copied from internet
  shuffleDice(array: Die[]): Die[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private chooseLetter(die: Die) {
    return die.getCharacter(Math.floor(Math.random() * Die.SIDES));
  }

  private setCharacter(index: number, letter: string) {
    const column = index % this.boardSize;
    const row = index / this.boardSize;
    this.shuffledBoard[row][column] = letter;
  }
}
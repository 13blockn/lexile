export class Board {
  private letters: string[][];

  constructor(letters: string[][]) {
    this.letters = letters;
  }

  printLetters() {
    this.letters.forEach((rowLetters) => {
      rowLetters.forEach((letter) => {
        console.log(letter);
      });
      console.log('\n');
    });
  }
}
import { Dictionary } from "../data/Dictionary";

export class WordValidator {
  private dictionary: Dictionary;
  private words: Set<string>;
  // private prefix: Prefix;
  constructor(wordList: string[]) {
    this.dictionary = new Dictionary(wordList);
    this.words = new Set();
  }


  public checkPrefix(input: string): boolean {
    if (input.length === 0) {
      return false;
    }

    return this.dictionary.isPrefix(input);
  }

  public checkAndAddToSolution(input: string): boolean {
    // Words must be longer than 2 letters
    if (input.length < 3) {
      return false;
    }

    // Shouldn't need to check if word is already in the dictionary because it is a set
    if (this.dictionary.lookup(input)) {
      this.words.add(input);
      return true;
    }

    return false;
  }

  public getWords(): Set<string> {
    return this.words;
  }
}

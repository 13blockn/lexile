import { Dictionary } from "../data/Dictionary";

export class WordValidator {
  private dictionary: Dictionary;
  private words: Set<string>;
  // private prefix: Prefix;
  constructor() {
    this.dictionary = new Dictionary();
    this.words = new Set();
  }

  public async initializeDictionary() {
    await this.dictionary.init();
  }

  public checkPrefix(input: string): boolean {
    if (input.length === 0) {
      return false;
    }

    return this.dictionary.lookup(input);
  }

  public check(input: string): boolean {
    // Words must be longer than 2 letters
    if (input.length < 3) {
      return false;
    }

    // Shouldn't need to check if word is already in the dictionary because it is a set
    if (this.dictionary.lookup(input)) {
      console.log(`Found word! ${input}`);
      this.words.add(input);
      return true;
    }

    return false;
  }

  public getWords(): Set<string> {
    return this.words;
  }
}

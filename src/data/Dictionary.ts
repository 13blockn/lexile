import { Trie } from "./Trie";
import * as fs from 'fs';
import * as readline from 'readline';

export class Dictionary {
  private trie: Trie;

  constructor() {
    //this.trie = Trie.buildTrie([]); // Can I afford to not initialize within the constructor?
  }

  async init(filePath: string): Promise<void> {
    const wordList = await this.loadWordsFromFile(filePath);
    this.trie = Trie.buildTrie(wordList);
  }

  private async loadWordsFromFile(filePath: string): Promise<string[]> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    const wordList: string[] = [];
    for await (const line of rl) {
      wordList.push(line.trim());
    }
    return wordList;
  }

  /**
   * Determine if word could possibly be in the dictionary
   * Used to speed up puzzle solution
   */
  isPrefix(word: string) {
    return this.trie.startsWith(word);
  }

  /**
   * Determine if completed word is in the dictionary
   */
  lookup(word: string) {
    return this.trie.searchTrie(word.toLowerCase());
  }
}

import { Trie, TrieTwo } from "./Trie";
// import * as fs from "fs";
// import * as readline from "readline";

// This class is no longer necessary IMO
export class Dictionary {
  //private trie: Trie;
  private trieTwo: TrieTwo;

  constructor(wordList: string[]) {
    //this.trie = Trie.buildTrie(wordList); // Can I afford to not initialize within the constructor?
    this.trieTwo = new TrieTwo();
    for (const word of wordList) {
      this.trieTwo.insert(word);
    }
  }

  /**
   * Determine if word could possibly be in the dictionary
   * Used to speed up puzzle solution
   */
  isPrefix(word: string) {
    //return this.trie.startsWith(word.toLowerCase());
    return this.trieTwo.startsWith(word.toLowerCase());
  }

  /**
   * Determine if completed word is in the dictionary
   */
  lookup(word: string) {
    //return this.trie.searchTrie(word.toLowerCase());
    return this.trieTwo.searchTrie(word.toLowerCase());
  }
}

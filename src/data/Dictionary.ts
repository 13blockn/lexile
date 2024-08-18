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
    //console.log(JSON.stringify(this.trie.children));
    //console.log(`TrieTwo: ${JSON.stringify(this.trieTwo.root)}`); // Seems correct
    //Promise.resolve(this.init());
  }

  // async init(): Promise<void> {
  //   const filePath = "./filtered_words.txt";
  //   const wordList = await this.loadWordsFromFile(filePath);
  //   this.trie = Trie.buildTrie(wordList);
  // }

  // // This doesn't work because I don't have access to the file system. Hate this for me
  // private async loadWordsFromFile(filePath: string): Promise<string[]> {
  //   const fileStream = fs.createReadStream(filePath);
  //   const rl = readline.createInterface({
  //     input: fileStream,
  //     crlfDelay: Infinity,
  //   });

  //   const wordList: string[] = [];
  //   for await (const line of rl) {
  //     wordList.push(line.trim());
  //   }
  //   return wordList;
  // }

  /**
   * Determine if word could possibly be in the dictionary
   * Used to speed up puzzle solution
   */
  isPrefix(word: string) {
    //return this.trie.startsWith(word.toLowerCase());
    //console.log(`Checking prefix ${word}`);
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

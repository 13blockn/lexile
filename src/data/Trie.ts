export class Trie {
  /** Check if the current node marks a complete word */
  #isEnd = false;

  /** Store sub-`Trie` */
  #children: Record<string, Trie> = {};

  constructor() {}

  public get isEnd() {
    return this.#isEnd;
  }

  public get children() {
    return this.#children;
  }

  /**
   * Check if given `char` is present in current `Trie`.
   */
  hasChar(char: string): Trie | null {
    const searchChar = this.children[char];
    if (typeof searchChar !== "undefined") {
      return searchChar;
    }

    return null;
  }

  /**
   * Add `Trie` at given `char`, and return new added `Trie`.
   */
  addChar(char: string): Trie {
    const newSubTrie = new Trie();
    this.children[char] = newSubTrie;
    return newSubTrie;
  }

  /**
   * Mark complete word found in current `Trie`.
   */
  makeEnd(): void {
    this.#isEnd = true;
  }

  /**
   * Search given `word` in `Trie`.
   */
  searchTrie(word: string): boolean {
    if (word.length === 0) {
      return this.#isEnd;
    }

    const subTrie = this.hasChar(word[0]);
    if (subTrie === null) {
      return false;
    }

    return subTrie.searchTrie(word.slice(1));
  }

  /**
   * Search given `prefix` in `Trie`.
   * Might want to store a root node, but I think Children has me covered
   */
  startsWith(prefix: string): boolean {
    if (prefix.length === 0) {
      return true;
    }

    //console.log(`prefix at 0 is ${prefix[0]}`)
    const subTrie = this.hasChar(prefix[0]);
    // No valid matches left in dictionary, must not be a prefix
    if (subTrie === null) {
      //console.log(`No valid prefixes for ${prefix}, subtrie: ${subTrie}`)
      return false;
    }

    return subTrie.searchTrie(prefix.slice(1));
  }
  /**
   * Add `word` to this `Trie`.
   */
  addWord(word: string): void {
    if (word.length === 0) {
      this.makeEnd();
      return;
    }
    //console.log(`adding word ${word}`);

    const subTrie = this.hasChar(word[0]);
    if (subTrie !== null) {
      return subTrie.addWord(word.slice(1));
    } else {
      const newSubTrie = this.addChar(word[0]);
      return newSubTrie.addWord(word.slice(1));
    }
  }

  /**
   * Static constructor to build a `Trie` from a list of words (`wordList`).
   */
  static buildTrie = (wordList: string[]): Trie => {
    const trie = new Trie();
    for (let i = 0; i < wordList.length; i++) {
      const word = wordList[i];
      trie.addWord(word);
    }

    return trie;
  };
}

class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }

  // Converts the TrieNode to a plain object (JSON serializable)
  toJSON() {
    return {
      children: this.children,
      isEndOfWord: this.isEndOfWord,
    };
  }
}

export class TrieTwo {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  searchTrie(word: string): boolean {
    let node = this.root;
    // Off by one?
    for (const char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;
    //console.log(JSON.stringify(node));
    for (const char of prefix) {
      // Might need to check for if it's end of word, but hopefully that will be covered by the basic
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    //console.log(`found prefix ${prefix}`);
    return true;
  }
}

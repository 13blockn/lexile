import { Board } from "../models/Board";
import { Coordinate } from "../models/Coordinate";
import { Word } from "../models/Word";
import { MoveValidator } from "./MoveValidator";
import { WordValidator } from "./WordValidator";
export class PuzzleSolver {
  private wordValidator: WordValidator;
  private moveValidator: MoveValidator;
  private iterations: number; // Used for tracking efficiency of solver

  constructor(moveValidator: MoveValidator, wordList: string[]) {
    this.wordValidator = new WordValidator(wordList);
    this.moveValidator = moveValidator;
    this.iterations = 0;
  }

  // Do I need to pass in a board, or should I pull from MoveValidator?
  // Also, if this is slow, I could make it async so the page loads faster
  public searchBoard(board: Board) {
    for (const coordinate of board.getCoordinates()) {
      this.dfs(board, coordinate, new Word());
    }
    console.log(`Number of iterations: ${this.iterations}`);
  }

  private dfs(board: Board, coordinate: Coordinate, word: Word) {
    this.iterations++;
    const letter: string = board.getTile(coordinate);
    //console.log(`Searching for letter: ${letter}`);
    const wordString = this.convert(board, word);
    //console.log(`Currently valid prefix: ${wordString}`);

    const updatedWord = new Word(word); // This is not the full word

    updatedWord.appendCharacter(coordinate);
    const updatedString = wordString + letter;
    //console.log(`Updated string: ${updatedString}`);
    this.wordValidator.checkAndAddToSolution(updatedString);

    for (const neighbor of board.getNeighbors(coordinate)) {
      // if (this.wordValidator.checkPrefix(updatedString)) {
      //   console.log(`Found valid prefix ${updatedString}`);
      // } else {
      //   console.log(`No valid prefix found ${updatedString}`);
      // }
      if (
        updatedString.length <= 25 &&
        this.moveValidator.isUnvisited(neighbor, updatedWord) &&
        this.wordValidator.checkPrefix(updatedString)
      ) {
        //console.log(`Beginning another iteration coord/neighbor:  ${updatedString}/${board.getTile(neighbor)}`);// coord: ${JSON.stringify(coordinate)}/neighbor: ${JSON.stringify(neighbor)}`)
        //console.log(`neighbor: ${JSON.stringify(neighbor)}, updated word ${JSON.stringify(updatedWord)}`);

        this.dfs(board, neighbor, updatedWord); // The problem is that updated word doesn't reset for recursion
      }
    }
  }

  // Convert Word object to string
  convert(board: Board, word: Word) {
    const path: Coordinate[] = word.path;
    //console.log(`path length: ${path.length}`);
    let wordString = "";
    for (const coordinate of path) {
      //console.log(`Board tile ${board.getTile(coordinate)}`);
      wordString += board.getTile(coordinate);
      //console.log(`word string in progress: ${wordString}`)
    };

    return wordString;
  }

  public getWords(): Set<string> {
    return this.wordValidator.getWords();
  }
}

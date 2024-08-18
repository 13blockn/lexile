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
    const wordString = this.convert(board, word);

    const updatedWord = new Word(word);

    updatedWord.appendCharacter(coordinate);
    const updatedString = wordString + letter;
    this.wordValidator.checkAndAddToSolution(updatedString);

    for (const neighbor of board.getNeighbors(coordinate)) {
      if (
        updatedString.length <= 25 &&
        this.moveValidator.isUnvisited(neighbor, updatedWord) &&
        this.wordValidator.checkPrefix(updatedString)
      ) {

        this.dfs(board, neighbor, updatedWord);
      }
    }
  }

  // Convert Word object to string
  convert(board: Board, word: Word) {
    const path: Coordinate[] = word.path;
    let wordString = "";
    for (const coordinate of path) {
      wordString += board.getTile(coordinate);
    };

    return wordString;
  }

  public getWords(): Set<string> {
    return this.wordValidator.getWords();
  }
}

import { Board } from "../models/Board";
import { Coordinate } from "../models/Coordinate";
import { Word } from "../models/Word";

export class MoveValidator {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  public getValidMoves(inputChar: string, word: Word): Coordinate[] {
    const tileLocations: Coordinate[] = this.board.getTileLocations(inputChar);
    if (tileLocations.length === 0) {
      return [];
    }

    const validLocations: Coordinate[] = [];
    for (const tileLocation of tileLocations) {
      if (
        this.isAdjacent(word.getLastCharLocation(), tileLocation) &&
        this.isUnvisited(tileLocation, word)
      ) {
        validLocations.push(tileLocation);
      }
    }
    return validLocations;
  }

  public isUnvisited(tileLocation: Coordinate, word: Word): boolean {
    for (const coordinate of word.path) {
      if (coordinate.equals(tileLocation)) {
        return false;
      }
    }
    return true;
  }

  public isAdjacent(
    currentLocation: Coordinate,
    tileLocation: Coordinate
  ): boolean {
    if (currentLocation === Word.UNSET) {
      return true;
    }
    const xDist = Math.abs(currentLocation.xCoord - tileLocation.xCoord);
    const yDist = Math.abs(currentLocation.yCoord - tileLocation.yCoord);

    return xDist <= 1 && yDist <= 1;
  }
}

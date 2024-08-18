import { Coordinate, Status } from "./Coordinate";

const UNSET: Coordinate = new Coordinate(-1, -1);
export class Word {
  public endPoint: Coordinate;
  public path: Coordinate[];
  static UNSET: Coordinate;

  constructor(word?: Word) {
    if (word) {
      this.endPoint = word.endPoint;
      this.path = word.path.map(coord => new Coordinate(coord.xCoord, coord.yCoord));
    } else {
      this.endPoint = UNSET;
      this.path = [];
    }
  }

  // No validation here yet
  appendCharacter(coord: Coordinate): void {
    coord.status = Status.VISITED; // Could have uninteded consequences
    this.path.push(coord);
    this.endPoint = coord;
  }

  removeCharacter(): void {
    if (this.path.length === 0) {
      return;
    }
    this.path.pop();
    this.endPoint = this.getLastCharLocation();
  }

  getLastCharLocation(): Coordinate {
    if (this.path.length === 0) {
      return UNSET;
    } else {
      return this.path[this.path.length - 1];
    }
  }
}

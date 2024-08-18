export class Coordinate {
  public xCoord: number;
  public yCoord: number;
  public status: Status;

  constructor(xCoord: number, yCoord: number) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.status = Status.UNVISITED;
  }

  equals(otherCoord: Coordinate) {
    return this.xCoord === otherCoord.xCoord && this.yCoord === otherCoord.yCoord;
  }
}

export enum Status {
  VISITED,
  UNVISITED,
  UNDETERMINED,
}

export class Coordinate {
  public xCoord: number;
  public yCoord: number;
  public status: Status;

  constructor(xCoord: number, yCoord: number) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.status = Status.UNVISITED;
  }
}

export enum Status {
  VISITED,
  UNVISITED,
  UNDETERMINED,
}

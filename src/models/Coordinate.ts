export class Coordinate {
  getXCoord() {
    throw new Error("Method not implemented.");
  }
  getYCoord() {
    throw new Error("Method not implemented.");
  }
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

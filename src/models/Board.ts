import { Coordinate } from "./Coordinate";

export class Board {
  private letters: string[][];
  private locations: Map<string, Coordinate[]>; // Map vs record??
  private neighbors: Map<Coordinate, Coordinate[]>;

  constructor(letters: string[][]) {
    this.letters = letters;
    this.locations = new Map<string, Coordinate[]>();
    this.neighbors = new Map<Coordinate, Coordinate[]>();
    this.initLocations();
    this.initEdges();
  }

  private initLocations(): void {
    for (let xCoord = 0; xCoord < this.letters.length; xCoord++) {
      for (let yCoord = 0; yCoord < this.letters[xCoord].length; yCoord++) {
        const letter = this.letters[xCoord][yCoord];
        const coord = new Coordinate(xCoord, yCoord);

        if (!this.locations.has(letter)) {
          this.locations.set(letter, [coord]);
        } else {
          this.locations.get(letter)!.push(coord);
        }
      }
    }
  }

  private initEdges(): void {
    for (let xCoord = 0; xCoord < this.letters.length; xCoord++) {
      for (let yCoord = 0; yCoord < this.letters[xCoord].length; yCoord++) {
        this.addEdges(xCoord, yCoord);
      }
    }
  }

  private addEdges(xCoord: number, yCoord: number): void {
    const letter = this.letters[xCoord][yCoord];
    const edges: Coordinate[] = [];

    for (let i = xCoord - 1; i <= xCoord + 1; i++) {
      for (let j = yCoord - 1; j <= yCoord + 1; j++) {
        if (
          i < 0 ||
          i >= this.letters.length ||
          j < 0 ||
          j >= this.letters[xCoord].length ||
          (i === xCoord && j === yCoord)
        ) {
          continue;
        }
        edges.push(this.getCoordinate(this.letters[i][j], i, j));
      }
    }
    this.neighbors.set(this.getCoordinate(letter, xCoord, yCoord), edges);
  }

  public getTileLocations(letter: string): Coordinate[] {
    return this.locations.get(letter) || [];
  }

  public getCoordinates(): Coordinate[] {
    const coordinates: Coordinate[] = [];

    for (let xCoord = 0; xCoord < this.letters.length; xCoord++) {
      for (let yCoord = 0; yCoord < this.letters[xCoord].length; yCoord++) {
        coordinates.push(
          this.getCoordinate(this.letters[xCoord][yCoord], xCoord, yCoord)
        );
      }
    }

    return coordinates;
  }

  private getCoordinate(
    letter: string,
    xCoord: number,
    yCoord: number
  ): Coordinate {
    const locations = this.getTileLocations(letter);
    const coord = new Coordinate(xCoord, yCoord);

    for (const coordinate of locations) {
      // Might want to implement my own equals function
      if (
        coordinate.xCoord === coord.xCoord &&
        coordinate.yCoord === coord.yCoord
      ) {
        return coordinate;
      }
    }

    throw new Error(
      `Unmapped Letter ${letter} at location (${xCoord}, ${yCoord})`
    );
  }

  public getNeighbors(coordinate: Coordinate): Coordinate[] {
    return this.neighbors.get(coordinate) || [];
  }

  public printBoard(): void {
    for (const row of this.letters) {
      console.log(row.join(""));
    }
  }

  public printLocations(): void {
    this.locations.forEach((coords, letter) => {
      console.log(
        `character: ${letter}`,
        coords.map((coord) => JSON.stringify(coord)).join(", ")
      );
    });
  }

  public printEdges(): void {
    this.neighbors.forEach((coords, coord) => {
      const letter = this.letters[coord.xCoord][coord.yCoord];
      console.log(
        `character: ${letter}`,
        coords.map((c) => this.letters[c.xCoord][c.yCoord]).join(", ")
      );
    });
  }

  public getTile(coordinate: Coordinate): string {
    return this.letters[coordinate.xCoord][coordinate.yCoord];
  }

  printLetters() {
    this.letters.forEach((rowLetters) => {
      rowLetters.forEach((letter) => {
        console.log(letter);
      });
      console.log("\n");
    });
  }
}

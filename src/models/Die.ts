export class Die {
  public static readonly DIE0 = new Die("QBZJXK");
  public static readonly DIE1 = new Die("HHLRDO");
  public static readonly DIE2 = new Die("TELPCI");
  public static readonly DIE3 = new Die("TTOTEM");
  public static readonly DIE4 = new Die("AEAEEE");
  public static readonly DIE5 = new Die("TOUOTO");
  public static readonly DIE6 = new Die("NHDTHO");
  public static readonly DIE7 = new Die("SSNSEU");
  public static readonly DIE8 = new Die("SCTIEP");
  public static readonly DIE9 = new Die("YIFPSR");
  public static readonly DIE10 = new Die("OVWRGR");
  public static readonly DIE11 = new Die("LHNROD");
  public static readonly DIE12 = new Die("RIYPRH");
  public static readonly DIE13 = new Die("EANDNN");
  public static readonly DIE14 = new Die("EEEEMA");
  public static readonly DIE15 = new Die("AAAFSR");
  public static readonly DIE16 = new Die("AFAIRS");
  public static readonly DIE17 = new Die("LONDDR");
  public static readonly DIE18 = new Die("GANNEM");
  public static readonly DIE19 = new Die("ITITIE");
  public static readonly DIE20 = new Die("AUMEEG");
  public static readonly DIE21 = new Die("FAIRSY");
  public static readonly DIE22 = new Die("CCSNWT");
  public static readonly DIE23 = new Die("UOTOWN");
  public static readonly DIE24 = new Die("ETILIC");

  public static fullSize = [
    Die.DIE0, Die.DIE1, Die.DIE2, Die.DIE3, Die.DIE4, Die.DIE5,
    Die.DIE6, Die.DIE7, Die.DIE8, Die.DIE9, Die.DIE10, Die.DIE11,
    Die.DIE12, Die.DIE13, Die.DIE14, Die.DIE15, Die.DIE16, Die.DIE17,
    Die.DIE18, Die.DIE19, Die.DIE20, Die.DIE21, Die.DIE22, Die.DIE23,
    Die.DIE24
  ];

  public static smallSize: Die[] = [
    Die.DIE0, Die.DIE1, Die.DIE2, Die.DIE3, Die.DIE4, Die.DIE7,
    Die.DIE8, Die.DIE9, Die.DIE10, Die.DIE13, Die.DIE17, Die.DIE19,
    Die.DIE20, Die.DIE21, Die.DIE23, Die.DIE11
  ]

  public static readonly SIDES = 6;

  private letters: string[];

  private constructor(letters: string) {
    if (letters.length !== 6) {
      throw new Error(`All dice should have six sides. Input: ${letters}`);
    }
    this.letters = letters.split('');
  }

  // This should live somewhere else, maybe in Board.ts?
  public static getDice(boardSize: number): Die[] {
    if (boardSize === 5) {
      return this.fullSize;
    } else if (boardSize === 4) {
      return this.smallSize;
    } else {
      throw new Error(`Unexpected board size ${boardSize}`)
    }
  }

  // This can return Qu
  public getCharacter(index: number): string {
    if (index < 0 || index >= Die.SIDES) {
      throw new Error('Index out of bounds');
    }
    return this.letters[index] === 'Q' ? 'QU' : this.letters[index];
  }
}

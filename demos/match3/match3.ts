interface Tile {
  x: number;
  y: number;
  value?: number; // mauybe any
  isEmpty?: boolean;
  customData?: any;
}


// This can be an observable

class Level {
  rows: number;
  columns: number;
  items: any;
  levelTiles: any[];
  selectedItem: any;
  constructor(opts: { rows: number; columns: number; items: any }) {
    this.rows = opts.rows;
    this.columns = opts.columns;
    this.items = opts.items;
  }

  buildLevel() {
    let levelTiles = [];
    this.selectedItem = false;
    for (let i = 0; i < this.rows; ++i) {
      levelTiles[i] = [];
      for (let j = 0; j < this.columns; ++j) {
        do {
          let randomValue = Math.floor(Math.random() * this.items);
          levelTiles[i][j] = {
            value: randomValue,
            isEmpty: false,
            row: i,
            columns: j
          };
          this.levelTiles = levelTiles;
        } while(this.isPartOfMatch(i, j))
      }
    }
  }
  matchInBoard() {
    for(let i = 0; i < this.rows; ++i) {
      for(let j = 0; j < this.columns; ++j) {
        if(this.isPartOfMatch(i,j)) {
          return true;
        }
      }
    }
    return false;
  }
  isPartOfMatch(row, column) {
    return this.isPartOfHorizonalMatch(row, column) || this.isPartOfVerticalMatch(row, column)
  }
  isPartOfHorizonalMatch(row, column) {
    let currentTile = this.valueAt(row, column);
    return (
      currentTile === this.valueAt(row, column - 1) && currentTile === this.valueAt(row, column - 2) ||
      currentTile === this.valueAt(row, column + 1) && currentTile === this.valueAt(row, column + 2) ||
      currentTile === this.valueAt(row, column - 1) && currentTile === this.valueAt(row, column + 1)
    );
  }
  isPartOfVerticalMatch(row, column) {
    let currentTile = this.valueAt(row, column);
    return (
      currentTile === this.valueAt(row - 1, column) && currentTile === this.valueAt(row - 2, column) ||
      currentTile === this.valueAt(row + 2, column) && currentTile === this.valueAt(row + 2, column) ||
      currentTile === this.valueAt(row - 1, column) && currentTile === this.valueAt(row + 1, column)
    );
  }
  valueAt(row, column) {
    if(!this.isValidPick(row, column)) {
      return false;
    }
    return this.levelTiles[row][column].value;
  }
  isValidPick(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.levelTiles[row] != undefined && this.levelTiles[row][column] != undefined;
  }

  getRows() {
    return this.rows;
  }
  getColumns() {
    return this.columns;
  }

  getSelectedItem() {
    return this.selectedItem;
  }
  setSelectedItem(row, column) {
    this.selectedItem = {
      row, column
    }
  }
  deselectItem() {
    this.selectedItem = false;
  }
  areTheSame(row, column, row2, column2) {
    return row === row2 || column === column2;
  }

  areNextToEachOther(row, column, row2, column2) {
    return Math.abs(row - row2) + Math.abs(column - column2) === 1;
  }
  
}
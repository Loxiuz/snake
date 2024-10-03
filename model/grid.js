export default class Grid {
  #rows;
  #cols;
  #grid;

  constructor(rows, cols) {
    this.#rows = rows;
    this.#cols = cols;
    this.#grid = this.#makeGrid(0);
  }

  #makeGrid(initialValue) {
    const grid = [];
    for (let r = 0; r < this.#rows; r++) {
      const row = [];
      for (let col = 0; col < this.#cols; col++) {
        row.push(initialValue);
      }
      grid.push(row);
    }
    return grid;
  }

  #isWithinGrid({ row, col }) {
    return row >= 0 && row < this.#rows && col >= 0 && col < this.#cols;
  }

  #convertCoordinates(coords, row, col) {
    if (typeof coords === "object" && coords !== null) {
      return coords;
    }
    return { row, col };
  }

  set({ row, col }, value) {
    if (row <= this.#rows && col <= this.#cols) {
      this.#grid[row][col] = value;
    }
  }

  get({ row, col }) {
    if (row <= this.#rows && col <= this.#cols) {
      return this.#grid[row][col];
    }
  }

  indexFor({ row, col }) {
    let i = 0;
    for (let r = 0; r < this.#rows; r++) {
      for (let c = 0; c < this.#cols; c++) {
        if (r === row && c === col) {
          return i;
        }
        i++;
      }
    }
  }

  rowColFor(index) {
    let i = 0;
    for (let r = 0; r < this.#rows; r++) {
      for (let c = 0; c < this.#cols; c++) {
        if (i === index) {
          return { row: r, col: c };
        }
        i++;
      }
    }
  }

  neighbours({ row, col }) {
    const neighbours = [];
    const directions = [
      { row: 1, col: -1 }, //SW
      { row: 0, col: -1 }, // W
      { row: -1, col: -1 }, // NW
      { row: -1, col: 0 }, // N
      { row: -1, col: 1 }, // NE
      { row: 0, col: 1 }, // E
      { row: 1, col: 1 }, // SE
      { row: 1, col: 0 }, // S
    ];
    if (this.#isWithinGrid({ row: row, col: col })) {
      for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;
        if (
          newRow >= 0 &&
          newRow < this.#rows &&
          newCol >= 0 &&
          newCol < this.#cols
        ) {
          neighbours.push({ row: newRow, col: newCol });
        }
      }
    }
    return neighbours;
  }

  neighbourValues({ row, col }) {
    const neighbours = this.neighbours({ row: row, col: col });
    return neighbours.map((neighbour) => {
      const nRow = neighbour.row;
      const nCol = neighbour.col;
      return this.#grid[nRow][nCol];
    });
  }

  nextInRow(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    if (this.#isWithinGrid({ row: r, col: c }) && c < this.#cols - 1) {
      const nextCol = c + 1;
      return { row: r, col: nextCol, value: this.#grid[r][nextCol] };
    }
  }

  nextInCol(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    if (this.#isWithinGrid({ row: r, col: c }) && r < this.#rows - 1) {
      const nextRow = r + 1;
      return { row: nextRow, col: c, value: this.#grid[nextRow][c] };
    }
  }

  north(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    if (this.#isWithinGrid({ row: r, col: c })) {
      const prevRow = r - 1;
      return { row: prevRow, col: c, value: this.#grid[prevRow][c] };
    }
  }

  south(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    return this.nextInCol({ row: r, col: c });
  }

  west(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    if (this.#isWithinGrid({ row: r, col: c })) {
      const prevCol = c - 1;
      return { row: r, col: prevCol, value: this.#grid[r][prevCol] };
    }
  }

  east(coords, row, col) {
    const { row: r, col: c } = this.#convertCoordinates(coords, row, col);
    return this.nextInRow({ row: r, col: c });
  }

  getRows() {
    return this.#rows;
  }

  getCols() {
    return this.#cols;
  }

  size() {
    return this.#rows * this.#cols;
  }

  fill(value) {
    this.#grid = this.#makeGrid(value);
  }

  dump() {
    for (let row = 0; row < this.#rows; row++) {
      console.log(this.#grid[row].join(" "));
    }
  }
}

"use strict";

import Grid from "../model/grid.js";
import Queue from "../model/queue.js";

window.addEventListener("load", () => {
  const controller = new Controller();
  controller.init();
});

const boardHeight = 15;
const boardWidth = 15;
const snakeStartSize = 3;

class Controller {
  constructor() {
    this.board = new Grid(boardHeight, boardWidth); //(Rows, colums)
    this.snake = new Queue();
    this.direction = "ArrowLeft";
    this.keyDown = this.keyDown.bind(this);
    this.tick = this.tick.bind(this);
  }

  init() {
    console.log("Controller script running...");
    document.addEventListener("keydown", this.keyDown);
    this.#initSnake();
    this.tick();
  }

  keyDown(e) {
    this.direction = e.key;
  }

  #initSnake() {
    const midRows = Math.floor(this.board.getRows() / 2);
    const midCols = Math.floor(this.board.getCols() / 2);
    for (let i = 0; i < snakeStartSize; i++) {
      this.snake.enqueue({ row: midRows, col: midCols + i });
    }
  }

  tick() {
    setTimeout(this.tick, 250);

    for (let i = 0; i < this.snake.size(); i++) {
      const s = this.snake.get(i).data;
      this.board.set({ row: s.row, col: s.col }, 0);
    }

    const head = {
      row: this.snake.get(this.snake.size() - 1).data.row,
      col: this.snake.get(this.snake.size() - 1).data.col,
    };

    switch (this.direction) {
      case "ArrowLeft":
        head.col--;
        if (head.col < 0) {
          head.col = this.board.getCols() - 1;
        }
        break;
      case "ArrowRight":
        head.col++;
        if (head.col === this.board.getCols()) {
          head.col = 0;
        }
        break;
      case "ArrowUp":
        head.row--;
        if (head.row < 0) {
          head.row = this.board.getRows() - 1;
        }
        break;
      case "ArrowDown":
        head.row++;
        if (head.row === this.board.getRows()) {
          head.row = 0;
        }
        break;
    }

    this.snake.enqueue(head);
    this.snake.dequeue();

    for (let i = 0; i < this.snake.size(); i++) {
      const s = this.snake.get(i).data;
      // console.log("After tick switch", s);
      this.board.set({ row: s.row, col: s.col }, 1);
    }

    this.#displayBoard();
    // this.board.dump();
  }

  #displayBoard() {
    const gridBoard = document.getElementById("grid-board");
    gridBoard.innerHTML = "";

    for (let row = 0; row < this.board.getRows(); row++) {
      for (let col = 0; col < this.board.getCols(); col++) {
        gridBoard.insertAdjacentHTML("beforeend", `<div class="cell"></div>`);
        const cell = gridBoard.lastElementChild;
        switch (this.board.get({ row: row, col: col })) {
          case 0:
            cell.classList.remove("player", "goal");
            break;
          case 1:
            cell.classList.add("player");
            break;
          case 2:
            cell.classList.add("goal");
            break;
        }
      }
    }
    //This will only show probably if rows and columns are the same
    document.getElementById(
      "grid-board"
    ).style = `grid-template-columns: repeat(${this.board.getRows()}, max-content)`;
  }
}

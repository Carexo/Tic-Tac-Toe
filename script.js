"use strict";

const board = document.querySelector(".board");
const allFields = document.querySelectorAll(".field");
const resetButton = document.querySelector(".reset");
const statusGameElement = document.querySelector(".status-game");
const scoreXElement = document.querySelector(".score-x");
const scoreOElement = document.querySelector(".score-o");

class Game {
  constructor() {
    this.currentPlayer = "x";
    this.newGameArray();
    board.addEventListener("click", this.handlePlayerMove.bind(this));
    resetButton.addEventListener("click", this.resetGame.bind(this));
  }

  newGameArray() {
    this.gameArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }

  handlePlayerMove(e) {
    const field = e.target.closest(".field");

    if (!field) return;

    this.updateGame(field);
  }

  updateCurrentPlayer() {
    if (this.currentPlayer === "x") this.currentPlayer = "o";
    else if (this.currentPlayer === "o") this.currentPlayer = "x";
  }

  updateGameArray(field) {
    const [placeFieldRow, placeFieldColumn] = [
      Number(field.dataset.row),
      Number(field.dataset.column),
    ];

    this.gameArray[placeFieldRow][placeFieldColumn] = this.currentPlayer;
  }

  updateUserInteface(field) {
    const imageElement = `<img src="img/char-${this.currentPlayer}.svg" />`;
    field.insertAdjacentHTML("afterbegin", imageElement);
    setTimeout(function () {
      field.childNodes[0].style.opacity = "1";
    }, 1);
  }

  updateStatus() {
    const status = `${this.currentPlayer.toUpperCase()} move`;
    statusGameElement.textContent = status;
  }

  updateGame(field) {
    if (field.children[0]) return;

    this.updateGameArray(field);
    this.updateUserInteface(field);
    this.updateCurrentPlayer();
    this.updateStatus();
  }

  resetGame() {
    this.newGameArray();
    this.currentPlayer = "x";
    this.updateStatus();
    allFields.forEach((field) => (field.textContent = ""));
  }
}

// for (const row of this.gameArray) {
//     for (const move of row) {
//       console.log(move);
//     }
//   }

const game = new Game();

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
    this.scoreX = 0;
    this.scoreO = 0;

    this.clickHandler = this.handlePlayerMove.bind(this);
    board.addEventListener("click", this.clickHandler);
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

  updateStatus(message) {
    const status = `${this.currentPlayer.toUpperCase()} move`;
    statusGameElement.textContent = message;
  }

  updateGame(field) {
    if (field.children[0]) return;

    this.updateGameArray(field);

    this.updateUserInteface(field);

    this.updateCurrentPlayer();

    this.updateStatus(`${this.currentPlayer.toUpperCase()} move`);

    this.checkStatus();
  }

  checkStatus() {
    const checkRow = () => {
      for (const row of this.gameArray) {
        const count = row.reduce((accumulator, playerMove) => {
          if (playerMove === "x") ++accumulator;
          if (playerMove === "o") --accumulator;
          return accumulator;
        }, 0);

        if (count === 3) return "x";

        if (count === -3) return "o";
      }
    };

    const checkColumn = () => {
      for (let i = 0; i < this.gameArray[0].length; i++) {
        let count = 0;
        for (let j = 0; j < this.gameArray.length; j++) {
          if (this.gameArray[j][i] === "x") ++count;
          if (this.gameArray[j][i] === "o") --count;
        }

        if (count === 3) return "x";

        if (count === -3) return "o";
      }
    };

    const checkCross = () => {
      let countLeft = 0,
        countRight = 0;

      for (let i = 0, j = 2; i < this.gameArray.length, j >= 0; i++, j--) {
        if (this.gameArray[i][i] === "x") ++countLeft;
        if (this.gameArray[i][i] === "o") --countLeft;

        if (this.gameArray[i][j] === "x") ++countRight;
        if (this.gameArray[i][j] === "o") --countRight;
      }

      if (countLeft === 3 || countRight === 3) return "x";

      if (countLeft === -3 || countRight === -3) return "o";
    };

    const checkDraw = () => {
      const flatGameArray = this.gameArray.flat();
      const filtredGameArrayFromMoves = flatGameArray.filter(
        (playerMove) => !playerMove
      );

      if (filtredGameArrayFromMoves.length === 0) {
        return true;
      }
    };

    if (checkDraw()) {
      board.removeEventListener("click", this.clickHandler);
      this.updateStatus(`Draw`);
    }

    if (checkColumn() === "x" || checkRow() === "x" || checkCross() === "x") {
      board.removeEventListener("click", this.clickHandler);
      this.updateStatus(`X won`);
      this.updateScore("x");
    }

    if (checkColumn() === "o" || checkRow() === "o" || checkCross() === "o") {
      board.removeEventListener("click", this.clickHandler);
      this.updateStatus(`O won`);
      this.updateScore("o");
    }
  }

  updateScore(wonPlayer) {
    if (wonPlayer === "x") this.scoreX++;
    if (wonPlayer === "o") this.scoreO++;
    scoreXElement.innerText = this.scoreX;
    scoreOElement.innerText = this.scoreO;
  }

  resetGame() {
    this.newGameArray();
    this.currentPlayer = "x";
    this.updateStatus("X move");
    allFields.forEach((field) => (field.textContent = ""));

    board.addEventListener("click", this.clickHandler);
  }
}

const game = new Game();

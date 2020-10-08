class GameBoard {
  constructor({ selector }) {
    this.gameInstances = [];
    this.rootSelector = selector;
  }

  createNewTicTacToeGame() {
    const boardSize = Math.floor(Math.random() * 5) + 3; //random number of boxes in a line, range (3, 8)
    const numberOfPlayers = Math.floor(Math.random() * boardSize) + 2; //random number of players, range (2, < numberof boxes)
    this.gameInstances.push(
      new TicTacToe({
        boardSize,
        numberOfPlayers,
        selector: this.rootSelector,
      })
    );
    this.updateGridSize();
  }

  updateGridSize() {
    document.querySelector(
      this.rootSelector
    ).style.gridTemplateColumns = `repeat(${Math.round(
      Math.sqrt(this.gameInstances.length) + 1
    )}, 1fr)`;
  }
}

const isEqual = (a) => (b) => a !== "" && a === b;
const createElement = (type, attributes) => {
  const element = document.createElement(type);
  Object.entries(attributes).forEach(([name, value]) => {
    if (name === "className") {
      element.classList.add(value);
    } else if (name.startsWith("on")) {
      const withoutOn = name.substr(2);
      element.addEventListener(
        withoutOn.charAt(0).toLowerCase() + withoutOn.slice(1),
        value
      );
    } else {
      element.setAttribute(name, value);
    }
  });

  return element;
};

class TicTacToe {
  constructor(config) {
    this.config = config;
    this.inProgress = true;
    this.id = +new Date(); // naive gameID, ideally should be guid
    this.boardSize = config.boardSize;
    this.numberOfPlayers = config.numberOfPlayers;
    this.numberOfCells;
    this.arrayOfStreak = []; // storing indexes of boxes with winning streak
    this.board = []; // player entries
    this.rootNode = this.initializeBoard();
    this.resetGame();
  }

  initializeBoard = () => {
    const parent = document.querySelector(this.config.selector);
    const rootNode = createElement("div", {
      className: "wrapper",
    });
    parent.appendChild(rootNode);
    return rootNode;
  };

  createNewBoard = () => {
    this.rootNode.innerHTML = "";

    const inputAttributes = {
      type: "number",
      placeholder: 4,
      min: 2,
      max: 10,
      step: 1,
    };

    const boardSizeInput = createElement("input", {
      ...inputAttributes,
      value: this.boardSize,
      onChange: this.handleBoxUnits,
    });

    const numberOfPlayersInput = createElement("input", {
      ...inputAttributes,
      value: this.numberOfPlayers,
      onChange: this.handlePlayersNumber,
    });

    const resetButton = createElement("button", {
      className: "resetGameButton",
      onClick: this.resetGame,
    });
    resetButton.textContent = "Reset game";

    let container = createElement("div", {
      className: "container",
      "data-id": this.id,
      onClick: this.handleTurn,
    });
    container.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;

    this.rootNode.appendChild(boardSizeInput);
    this.rootNode.appendChild(numberOfPlayersInput);
    this.rootNode.appendChild(resetButton);
    this.rootNode.appendChild(container);
    this.createBoxes(container);
  };

  createBoxes = (container) => {
    this.numberOfCells = Math.pow(this.boardSize, 2);
    this.board = [];

    for (let i = 0; i < this.numberOfCells; i++) {
      this.board[i] = "";
      container.appendChild(
        createElement("div", {
          className: "box",
          "data-id": i,
        })
      );
    }
  };

  createPlayers = () => {
    const players = new Map();
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      players.set(i, { id: i });
    }
    return players;
  };

  handleTurn = (event) => {
    let boxId = event.target.dataset.id; //get id of the clicked box

    if (this.board[boxId] === "" && this.inProgress) {
      this.board[boxId] = this.currentPlayer.id;
      document.querySelector(
        `[data-id="${this.id}"] [data-id="${boxId}"]`
      ).textContent = this.currentPlayer.id;

      //check if any users made winning streak
      if (this.isGameOver()) {
        this.inProgress = false;
        const boxes = document.querySelectorAll(
          `[data-id="${this.id}"] [data-id]`
        );
        this.arrayOfStreak.forEach((element) =>
          boxes[element].classList.add("box-success")
        );
      }

      const playerIds = Array.from(this.players.keys());
      this.currentPlayer = this.players.get(
        playerIds[
          (playerIds.indexOf(this.currentPlayer.id) + 1) % playerIds.length
        ]
      );
    }
  };

  handleBoxUnits = ({ target }) => {
    this.boardSize = parseInt(target.value, "10"); //get integer from the input box
    this.resetGame();
  };

  handlePlayersNumber = ({ target }) => {
    this.numberOfPlayers = target.valueAsNumber;
    this.resetGame();
  };

  resetGame = () => {
    this.players = this.createPlayers();
    this.currentPlayer = this.players.values().next().value;
    this.createNewBoard();
    this.inProgress = true;
  };

  isGameOver = () => {
    return (
      this.checkHorizontally() ||
      this.checkVertically() ||
      this.checkDiagonally()
    );
  };

  checkHorizontally = () => {
    for (let i = 0; i < this.numberOfCells; i += this.boardSize) {
      const row = this.board.slice(i, i + this.boardSize);
      if (row.every(isEqual(this.board[i]))) {
        //caclulate indexes of boxes that contain the streak
        let temp = i;
        row.forEach((element) => this.arrayOfStreak.push(temp++));
        return true;
      }
    }
    return false;
  };

  checkVertically = () => {
    for (let i = 0; i < this.boardSize; i++) {
      if (
        this.board
          .filter((element, index) => (index - i) % this.boardSize == 0)
          .every(isEqual(this.board[i]))
      ) {
        //caclulate indexes of boxes that contain the streak
        this.arrayOfStreak = this.board
          .map((element, index) =>
            (index - i) % this.boardSize == 0 ? index : null
          )
          .filter((element) => element);
        if (i == 0) this.arrayOfStreak.unshift(0);
        return true;
      }
    }
    return false;
  };

  checkDiagonally = () => {
    // check from top left to bottom right
    if (
      this.board
        .filter(
          (element, index) => index % (this.boardSize + 1) == 0 || index == 0
        )
        .every(isEqual(this.board[0]))
    ) {
      //caclulate indexes of boxes that contain the streak
      this.arrayOfStreak = this.board
        .map((element, index) =>
          index % (this.boardSize + 1) == 0 || index == 0 ? index : null
        )
        .filter((element) => element);
      this.arrayOfStreak.unshift(0);
      return true;
    }
    // check from top right to bottom left
    if (
      this.board
        .filter(
          (element, index) =>
            index % (this.boardSize - 1) == 0 &&
            index != 0 &&
            index != this.numberOfCells - 1
        )
        .every(isEqual(this.board[this.boardSize - 1]))
    ) {
      this.arrayOfStreak = this.board
        .map((element, index) =>
          index % (this.boardSize - 1) == 0 &&
          index != 0 &&
          index != this.numberOfCells - 1
            ? index
            : null
        )
        .filter((element) => element);
      return true;
    }
    return false;
  };
}

// grid 3x3
// event listeners on each box
// states: start, which player's turn, two players: tie, 1-0, 0-1
// board state: "X", "O", function for changing board state
// render each state

// TO DO:
// disallow multiple clicks on the same box
// print value in UI
// check results after each turn (check for reaccuring symbols or have patterns)
// expand board

class GameBoard {
  constructor() {
    this.gameInstances = [];
  }

  createNewTicTacToeGame() {
    const randomNumber = Math.floor(Math.random() * 5) + 3;
    this.gameInstances.push(
      new TicTacToe(randomNumber, this.gameInstances.length)
    );
    this.updateGridSize();
  }

  updateGridSize() {
    ticTacToeBodyDiv.style.gridTemplateColumns = `repeat(${Math.round(
      Math.sqrt(this.gameInstances.length) + 1
    )}, 1fr)`;
  }
}

class TicTacToe {
  constructor(lineSize, id) {
    this.isGameStarted = true;
    this.id = id; //gameID
    this.lineSize = lineSize; //number of tiles/boxes in each row and column
    this.numberOfCells; //variable to store total number of boxes (lineSize*lineSize)
    this.currentPlayerID = 0; // "0" - first player; "1" - second player

    this.bodyWrapper; //wrapper div that containes both gameContainer and inputNumberBox
    this.gameContainer; //container div for storing x*x tiles/boxes of the game
    this.inputNumberBox; //input div box for each board
    this.resetGameButton;

    this.gameOutput = []; //array that keeps track of divs that have X and O in the UI
    this.arrayOfStreak = []; //array for storing indexes of boxes with winning streak
    this.board = []; //array that keeps track of the actual X and O

    this.createNewBoard();
  }

  createNewBoard() {
    //create new wrapper div for this specific game
    let newBodyWrapper = document.createElement("div");
    newBodyWrapper.classList.add("wrapper");
    ticTacToeBodyDiv.appendChild(newBodyWrapper);
    this.bodyWrapper = newBodyWrapper;

    //create input box for this specific div with correct attribbutes
    let newInputBox = document.createElement("input");
    newInputBox.classList.add("boxUnitsInput");
  const attrs = {
    type: "number",
    placeholder: 4,
    min: 3,
    max: 10,
    step: 1,
    value: this.lineSize,
  };

  Object.entries(attrs)
    .forEach(([key, value]) => newInputBox.setAttribute(key, value))
    this.inputNumberBox = newInputBox;
    this.bodyWrapper.appendChild(this.inputNumberBox);

    let newResetGameButton = document.createElement("button");
    newResetGameButton.textContent = "Reset game";
    newResetGameButton.classList.add("resetGameButton");
    this.resetGameButton = newResetGameButton;
    this.bodyWrapper.appendChild(this.resetGameButton);

    //create container for tiles/boxes to be used later to add boxes
    let newContainer = document.createElement("div");
    newContainer.classList.add("container");
    this.gameContainer = newContainer;
    this.bodyWrapper.appendChild(this.gameContainer);

    //add event listeners to handle clicks for this specific game
    this.gameContainer.addEventListener("click", this.handleTurn.bind(this));
    this.inputNumberBox.addEventListener(
      "change",
      this.handleBoxUnits.bind(this)
    );
    this.resetGameButton.addEventListener("click", this.resetGame.bind(this));

    this.createNewBoardBoxes();
  }

  createNewBoardBoxes() {
    this.numberOfCells = this.lineSize * this.lineSize; //do calculations each time there is a change in lineSize
    this.board = [];
    this.gameContainer.style.gridTemplateColumns = `repeat(${this.lineSize}, 1fr)`; //adjust grid value to have a correct square UI

    for (let i = 0; i < this.numberOfCells; i++) {
      this.board[i] = "";
      let newNode = document.createElement("div");
      newNode.classList.add("box");
      newNode.setAttribute("data-id", i);
      this.gameContainer.appendChild(newNode);
    }
    this.gameOutput = this.gameContainer.querySelectorAll("[data-id]");

    this.isGameStarted = true;
  }

  handleTurn(event) {
    let clickedBoxID = event.target.dataset.id; //get id of the clicked box

    if (this.board[clickedBoxID] == "" && this.isGameStarted) {
      //check if the box is empty and the game has not ended yet
      this.board[clickedBoxID] = this.currentPlayerID === 0 ? "O" : "X"; //add current player symbol to the board array
      this.gameOutput[clickedBoxID].textContent = this.board[clickedBoxID]; //add current player symbol to the UI
      this.currentPlayerID = this.currentPlayerID === 0 ? 1 : 0; //change current player so other can take turn

      if (this.thereIsWinningStreak(this)) {
        //check if any users made winning streak
        this.isGameStarted = false; //set the game state to end
        // add class with different styling to the boxes of winning streak
        this.arrayOfStreak.forEach((element) =>
          this.gameOutput[element].classList.add("box-success")
        );
      }
    }
  }

  handleBoxUnits({ target }) {
    this.lineSize = parseInt(target.value, "10"); //get integer from the input box
    this.resetGame();
  }

  resetGame() {
    this.gameContainer.textContent = ""; // erase current game container
    this.createNewBoardBoxes(); //fill current game container
  }

  thereIsWinningStreak() {
    return (
      this.checkHorizontally() ||
      this.checkVertically() ||
      this.checkDiagonally()
    );
  }

  arrayValuesEqual(array, i, element) {
    return element == array[i] && array[i] != "";
  }

  checkHorizontally() {
    for (let i = 0; i < this.numberOfCells; i += this.lineSize) {
      const arrayOfHorizontalIndexes = this.board.slice(i, i + this.lineSize);
      if (
        arrayOfHorizontalIndexes.every((element) =>
          this.arrayValuesEqual(this.board, i, element)
        )
      ) {
        //caclulate indexes of boxes that contain the streak
        let temp = i;
        arrayOfHorizontalIndexes.forEach((element) =>
          this.arrayOfStreak.push(temp++)
        );
        return true;
      }
    }
    return false;
  }

  checkVertically() {
    for (let i = 0; i < this.lineSize; i++) {
      if (
        this.board
          .filter((element, index) => (index - i) % this.lineSize == 0)
          .every((element) => this.arrayValuesEqual(this.board, i, element))
      ) {
        //caclulate indexes of boxes that contain the streak
        this.arrayOfStreak = this.board
          .map((element, index) =>
            (index - i) % this.lineSize == 0 ? index : null
          )
          .filter((element) => element);
        if (i == 0) this.arrayOfStreak.unshift(0);
        return true;
      }
    }
    return false;
  }

  checkDiagonally() {
    // check from top left to bottom right
    if (
      this.board
        .filter(
          (element, index) => index % (this.lineSize + 1) == 0 || index == 0
        )
        .every((element) => this.arrayValuesEqual(this.board, 0, element))
    ) {
      //caclulate indexes of boxes that contain the streak
      this.arrayOfStreak = this.board
        .map((element, index) =>
          index % (this.lineSize + 1) == 0 || index == 0 ? index : null
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
            index % (this.lineSize - 1) == 0 &&
            index != 0 &&
            index != this.numberOfCells - 1
        )
        .every((element) =>
          this.arrayValuesEqual(this.board, this.lineSize - 1, element)
        )
    ) {
      this.arrayOfStreak = this.board
        .map((element, index) =>
          index % (this.lineSize - 1) == 0 &&
          index != 0 &&
          index != this.numberOfCells - 1
            ? index
            : null
        )
        .filter((element) => element);
      return true;
    }
    return false;
  }
}

/*
const games = [
  new TicTacToe({ size: 3 }),
  new TicTacToe({ size: 5 }),
  new TicTacToe({ size: 9001 }),
]

games[0].reset()

games.push(new TicTacToe())
*/

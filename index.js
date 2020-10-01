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

const root = document.documentElement;
const htmlBodyDiv = document.querySelector("body");
const ticTacToeBodyDiv = document.querySelector(".ticTacToeGame");

class TicTacToe {

    constructor (lineSize, id) {
        // public class fields not supported in Safari so defined here
        this.gameOutput;
        this.ameContainer;
        this.inputNumberBox;
        this.bodyWrapper;
        this.isGameStarted = true;
        this.id = id;
        this.lineSize = lineSize;
        this.currentPlayerId = 0; // "0" - first player; "1" - second player
        this.arrayOfStreak = [];
        this.board = [];
        this.createNewBoard();
    }

    createNewBoard() {
        let newBodyWrapper = document.createElement("div");
        newBodyWrapper.classList.add("wrapper");
        ticTacToeBodyDiv.appendChild(newBodyWrapper);
        this.bodyWrapper = newBodyWrapper;

        let newInputBox = document.createElement("input");
        newInputBox.classList.add("boxUnitsInput");
        
        newInputBox.setAttribute("type", "number");
        newInputBox.setAttribute("placeholder", "4");
        newInputBox.setAttribute("min", "3");
        newInputBox.setAttribute("max", "30");
        newInputBox.setAttribute("step", "1");
        newInputBox.setAttribute("value", this.lineSize);
        this.inputNumberBox = newInputBox;
        this.bodyWrapper.appendChild(this.inputNumberBox);

        let newContainer = document.createElement("div");
        newContainer.classList.add("container");
        this.gameContainer = newContainer;
        this.bodyWrapper.appendChild(this.gameContainer);

        this.gameContainer.addEventListener("click", this.handleTurn.bind(this));
        this.inputNumberBox.addEventListener("change", this.handleBoxUnits.bind(this));

        this.createBoard();
    }

    createBoard() {
        this.numberOfCells = this.lineSize * this.lineSize;
        this.board = [];
        this.gameContainer.style.gridTemplateColumns = `repeat(${this.lineSize}, 1fr)`;

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
        console.log(this, this.id);
        let clickedBox = event.target.dataset.id;
        console.log(this.gameOutput, this.id);
        if (this.board[clickedBox] == "" && this.isGameStarted) {
            this.board[clickedBox] = this.currentPlayerId === 0 ? "O" : "X";
            console.log(this.board);
            this.currentPlayerId = this.currentPlayerId === 0 ? 1 : 0;
            this.gameOutput[clickedBox].textContent = this.board[clickedBox];
            if (thereIsWinningStreak(this)) {
                this.isGameStarted = false;
                console.log((this.currentPlayerId === 1 ? "O" : "X") + " won");
                this.arrayOfStreak.forEach((element) =>
                    this.gameOutput[element].classList.add("box-success")
                );
            }
        }
    }
    
    handleBoxUnits({ target }) {
        this.lineSize = parseInt(target.value, "10");
        console.log(target.value, "10");
        console.log(this.lineSize);
        this.gameContainer.textContent = "";
        console.log(this.bodyWrapper);
        this.createBoard();
    }
}


class GameBoard {
    constructor() {
        this.gameInstances = [];
        this.numberOfGames = 0;
    }

    createNewGame() {
        const randomNumber = Math.floor(Math.random() * 5) + 3;
        this.numberOfGames++;
        this.gameInstances.push = new TicTacToe(randomNumber, this.numberOfGames);
        console.log(this.gameInstances);
        this.updateGridSize();
    }

    updateGridSize() {
        ticTacToeBodyDiv.style.gridTemplateColumns = `repeat(${Math.round(Math.sqrt(this.numberOfGames) + 1)}, 1fr)`;
        console.log(Math.round(Math.sqrt(this.numberOfGames) + 1));
    }

}

let ticTacToeBoard = new GameBoard();
document.querySelector(".newGameButton").addEventListener("click", ticTacToeBoard.createNewGame.bind(ticTacToeBoard));

function thereIsWinningStreak(game) {
    return checkHorizontally(game) || checkVertically(game) || checkDiagonally(game);
}

function arrayValuesEqual(array, i, element) {
    return element == array[i] && array[i] != "";
}

function checkHorizontally(game) {
    for (let i = 0; i < game.numberOfCells; i += game.lineSize) {
        if (
            game.board
            .slice(i, i + game.lineSize)
            .every((element) => arrayValuesEqual(game.board, i, element))
        ) {
            let temp = i;
            game.board
            .slice(i, i + game.lineSize)
            .forEach(element => game.arrayOfStreak.push(temp++));
            return true;
        }
    }
    return false;
}

function checkVertically(game) {
    for (let i = 0; i < game.lineSize; i++) {
        if (
            game.board
            .filter((element, index) => (index - i) % game.lineSize == 0)
            .every((element) => arrayValuesEqual(game.board, i, element))
        ) {
            console.log(game.board
                .map((element, index) => ((index - i) % game.lineSize == 0) ? index : null));
            game.arrayOfStreak = game.board
            .map((element, index) => ((index - i) % game.lineSize == 0) ? index : null)
            .filter(element => element);
            if (i == 0) game.arrayOfStreak.unshift(0);
            return true;
        }
    }
    return false;
}

function checkDiagonally(game) {
    // check from top left to bottom right
    if (
        game.board
        .filter((element, index) => index % (game.lineSize + 1) == 0 || index == 0)
        .every((element) => arrayValuesEqual(game.board, 0, element))
    ) {
        return true;
    }
    // check from top right to bottom left
    if (
        game.board
        .filter(
            (element, index) =>
            index % (game.lineSize - 1) == 0 &&
            index != 0 &&
            index != game.numberOfCells - 1
        )
        .every((element) => arrayValuesEqual(game.board, game.lineSize - 1, element))
    ) {
        return true;
    }
    return false;
}

// ADD SVG ICON INSTEAD OF TEXT SYMBOLS
// let firstPlayerSymbol = document.createElement("svg");
// firstPlayerSymbol.textContent = `<svg xmlns="http://www.w3.org/2000/svg"
//         width="19.438px" height="19.438px">
//        <polygon points="9.72,13.348 15.807,19.438 19.436,15.809 13.35,9.721 19.438,3.632 15.807,0 9.718,6.089 3.63,0 0.001,3.629
//            6.089,9.718 0,15.807 3.631,19.438"/>
//     </svg>`;

/*
const games = [
  new TicTacToe({ size: 3 }),
  new TicTacToe({ size: 5 }),
  new TicTacToe({ size: 9001 }),
]

games[0].reset()

games.push(new TicTacToe())
*/

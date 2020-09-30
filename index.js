
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

// let gameStarted = false;
// let playersTurn = 0; // "0" - first player; "1" - second player
// let board = ['','','','','','','','',''];

// function handleTurn(event) {
//     if (event.target.classList.contains("box")) {
//         let clickedBox = event.target.dataset.id;
//         board[clickedBox] = (playersTurn === 0 ? "X" : "O");
//         playersTurn = (playersTurn === 0 ? 1 : 0);
//         console.log(board);
//     }
// }

// let boxes = document.querySelector(".container");
// boxes.addEventListener('click', handleTurn);

let gameStarted = true;
let playersTurn = 0; // "0" - first player; "1" - second player
let board = ['','','','','','','','','','','','','','','',''];
let boxUnits = 4; //dimensions n times n of the board
let arrayOfStreak = []; //the boxes the form winning streak

//container of the boxes
let boxes = document.querySelector(".container"); 
boxes.addEventListener('click', handleTurn);

let inputNumberBox = document.querySelector("#boxUnitsInput");
inputNumberBox.addEventListener('change', handleBoxUnits);

//the boxes where user input is
let gameOutput = document.querySelectorAll("[data-id]");


let root = document.documentElement;

function newGame() {
    gameStarted = true;
    board = [];
    gameOutput = document.querySelectorAll("[data-id]");
    arrayOfStreak = [];

    for(let i = 0; i < boxUnits*boxUnits; i++) {
        board[i] = '';
    }
}

function arrayValuesEqual (array, i, element) {
    return element == array[i] && array[i]!= '';
}

function checkHorizontally() {
    for (let i = 0; i < boxUnits*boxUnits; i+=boxUnits) {
        if (board
            .slice(i, i + boxUnits)
            .every(element => arrayValuesEqual(board, i, element))) {
                // let temp = i;
                // board.slice(i, i + boxUnits).forEach(element => arrayOfStreak.push(temp++));
                return true;
            };
    }
    return false;

}

function checkVertically() {
    for (let i = 0; i < boxUnits; i++) {
        if (board
            .filter((element, index) => (index - i) % boxUnits == 0)
            .every(element => arrayValuesEqual(board, i, element))) {
                return true;
            };
    }
    return false;
}

function checkDiagonally() {
    // check from top left to bottom right
    if (board
        .filter((element, index) => (index % (boxUnits + 1)) == 0 || index == 0)
        .every(element => arrayValuesEqual(board, 0, element))) {
            return true;
        };
    // check from top right to bottom left
    if (board
        .filter((element, index) => (index % (boxUnits - 1)) == 0 && index != 0 && index!=boxUnits*boxUnits-1)
        .every(element => arrayValuesEqual(board, boxUnits-1, element))) {
            return true;
        };
    return false;

}

function checkResults() {
    return checkHorizontally() || checkVertically() || checkDiagonally();
}

function handleTurn(event) {
    let clickedBox = event.target.dataset.id; 
    if (board[clickedBox] == '' && gameStarted) { 
        board[clickedBox] = (playersTurn === 0 ? "X" : "O");
        playersTurn = (playersTurn === 0 ? 1 : 0);
        gameOutput = document.querySelectorAll("[data-id]");
        gameOutput[clickedBox].textContent = board[clickedBox];
        // console.log(board);
        if (checkResults(board)) {
            gameStarted = false;
            console.log((playersTurn === 1 ? "X" : "O") + " won");
            // console.log(arrayOfStreak);
            arrayOfStreak.forEach(element => gameOutput[element].classList.add("box-success"));
        };
    }
}

function handleBoxUnits() {
    boxUnits = parseInt(inputNumberBox.value);
    boxes.textContent = '';
    root.style.setProperty("--box-units", boxUnits);
    newGame();

    for(let i = 0; i < boxUnits*boxUnits; i++) {
        let newNode = document.createElement("div");
        newNode.classList.add("box");
        newNode.setAttribute("data-id", i);
        boxes.appendChild(newNode);
    }
}

// ADD SVG ICON INSTEAD OF TEXT SYMBOLS
// let firstPlayerSymbol = document.createElement("svg");
// firstPlayerSymbol.textContent = `<svg xmlns="http://www.w3.org/2000/svg" 
//         width="19.438px" height="19.438px">
//        <polygon points="9.72,13.348 15.807,19.438 19.436,15.809 13.35,9.721 19.438,3.632 15.807,0 9.718,6.089 3.63,0 0.001,3.629 
//            6.089,9.718 0,15.807 3.631,19.438"/>
//     </svg>`;




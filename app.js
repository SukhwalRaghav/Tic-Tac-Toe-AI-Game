let boxes = document.querySelectorAll(".box");
let resetGame = document.querySelector("#resetgame");
let newGame = document.querySelector("#newgame");
let playerVsPlayerButton = document.querySelector("#playerVsPlayer");
let playerVsComputerButton = document.querySelector("#playerVsComputer");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // true = PlayerO's turn, false = PlayerX's turn
let gameOver = false; // Initialize gameOver variable
let vsComputer = false; // Flag to determine if the game is against the computer

let winPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6]
];

const initializeGame = (isVsComputer) => {
    turnO = true; // PlayerO starts first
    gameOver = false;
    vsComputer = isVsComputer;
    enableBoxes();
    msgContainer.classList.add("hide");
};

const resetGames = () => {
    initializeGame(vsComputer);
};

const makeMove = (box, player) => {
    if (!box.innerText && !gameOver) {
        box.innerText = player;
        box.disabled = true;
        turnO = player === "X"; // Toggle turn
        if (!vsComputer && !gameOver) {
            checkWinner();
        }
    }
};

const disabledBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disabledBoxes();
    gameOver = true;
};

const checkWinner = () => {
    for (let pattern of winPattern) {
        let [a, b, c] = pattern;
        let posVal1 = boxes[a].innerText;
        let posVal2 = boxes[b].innerText;
        let posVal3 = boxes[c].innerText;

        if (posVal1 !== "" && posVal1 === posVal2 && posVal2 === posVal3) {
            showWinner(posVal1);
            return;
        }
    }

    // Check for draw
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
        gameOver = true;
    }
};

const computerMove = () => {
    if (!gameOver) {
        // Try to win
        if (tryToWinOrBlock("X")) return;

        // Try to block the opponent from winning
        if (tryToWinOrBlock("O")) return;

        // Make a random move
        let availableBoxes = [...boxes].filter(box => box.innerText === "");
        if (availableBoxes.length > 0) {
            let randomBox = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
            makeMove(randomBox, "X");
            checkWinner();
        }
    }
};


const tryToWinOrBlock = (player) => {
    for (let pattern of winPattern) {
        let [a, b, c] = pattern;
        let posVal1 = boxes[a].innerText;
        let posVal2 = boxes[b].innerText;
        let posVal3 = boxes[c].innerText;

        if (posVal1 === player && posVal2 === player && posVal3 === "") {
            makeMove(boxes[c], "X");
            checkWinner();
            return true;
        } else if (posVal1 === player && posVal3 === player && posVal2 === "") {
            makeMove(boxes[b], "X");
            checkWinner();
            return true;
        } else if (posVal2 === player && posVal3 === player && posVal1 === "") {
            makeMove(boxes[a], "X");
            checkWinner();
            return true;
        }
    }
    return false;
};

// Event listeners
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!gameOver) {
            if (vsComputer) {
                if (turnO) {
                    makeMove(box, "O");
                    checkWinner();
                    if (!gameOver) {
                        setTimeout(computerMove, 500); // delay the computer's move for better UX
                    }
                }
            } else {
                if (turnO) {
                    makeMove(box, "O");
                } else {
                    makeMove(box, "X");
                }
                checkWinner();
            }
        }
    });
});

playerVsPlayerButton.addEventListener("click", () => {
    initializeGame(false); // Player vs Player
});

playerVsComputerButton.addEventListener("click", () => {
    initializeGame(true); // Player vs Computer
});

newGame.addEventListener("click", resetGames);
resetGame.addEventListener("click", resetGames);

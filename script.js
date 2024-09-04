const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (boardState[clickedIndex] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    updateCell(clickedCell, clickedIndex);
    checkResult();
    if (gameActive) {
        currentPlayer = 'O';
        statusText.textContent = "Computer's turn";
        setTimeout(() => computerMove(), 500);
    }
}

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const winCombo = winningCombinations[i];
        const a = boardState[winCombo[0]];
        const b = boardState[winCombo[1]];
        const c = boardState[winCombo[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    const roundDraw = !boardState.includes('');
    if (roundDraw) {
        statusText.textContent = `It's a draw!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'X') {
        statusText.textContent = `Player X's turn`;
    }
}

function computerMove() {
    const bestMove = minimax(boardState, 'O').index;
    const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
    updateCell(cell, bestMove);
    checkResult();

    if (gameActive) {
        currentPlayer = 'X';
        statusText.textContent = `Player X's turn`;
    }
}

function minimax(newBoard, player) {
    const availableCells = newBoard
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (availableCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableCells.length; i++) {
        const move = {};
        move.index = availableCells[i];
        newBoard[availableCells[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availableCells[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function restartGame() {
    currentPlayer = 'X';
    boardState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `Player X's turn`;
    gameActive = true;
    cells.forEach(cell => (cell.textContent = ''));
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

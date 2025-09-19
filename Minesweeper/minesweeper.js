let numRows = 8; 
let numCols = 8; 
let numMines = 10; 
let isGameOver = false; 
let wonGame = false; 

document.addEventListener("DOMContentLoaded", () => {
    const rowsInp = document.getElementById("rows")
    const colsInp = document.getElementById("cols")
    const minesInp = document.getElementById("mines")
    const rowsVal = document.getElementById("numRows")
    const colsVal = document.getElementById("numCols")
    const minesVal = document.getElementById("numMines")
    const startBtn = document.getElementById("startBtn")

    const syncLabels = () => {
        rowsVal.textContent = rowsInp.value
        colsVal.textContent = colsInp.value

        const maxMines = Math.max(1, rowsInp.value * colsInp.value - 1)
        minesInp.max = maxMines

        if (+minesInp.value > maxMines) {
            minesInp.value = maxMines
        }
        minesVal.textContent = minesInp.value
    }

    rowsInp.addEventListener("input", syncLabels)
    colsInp.addEventListener("input", syncLabels)
    minesInp.addEventListener("input", syncLabels)
    syncLabels()

    startBtn.addEventListener("click", () => {
        isGameOver = false
        const status = document.getElementById("status")
        if (status) {
            status.textContent = ""
        }
        gameBoard.style.pointerEvents = "auto"

        numRows = +rowsInp.value
        numCols = +colsInp.value
        numMines = +minesInp.value


        initBoard()
        placeMines()
        calcCounts()
        renderBoard()
    })

    
})

const gameBoard = document.getElementById("gameBoard")
let board = []

function endGame(won) {
    if (isGameOver) {
        return
    }

    isGameOver = true

    let wrongFlags = 0
    let minesFound = 0

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++)  {
            const cell = board[i][j]

            if (cell.flagged && cell.isMine) {
                minesFound++
                cell.flagCorrect = true
            } else if (cell.flagged && !cell.isMine) {
                wrongFlags++
                cell.flagWrong = true
            }
            cell.revealed = true
        }
        
    }

    gameBoard.style.pointerEvents = "none"

    renderBoard()

    const status = document.getElementById("status")
    if (status) {
        if (won) {
            status.textContent = `You win! Correct flags: ${minesFound}/${numMines}`
        } else {
            status.textContent = `You lose Correct flags: ${minesFound}/${numMines}. Incorrect flags: ${wrongFlags}`
        }
    } else {
        console.log({won, minesFound, wrongFlags})
    }
}

function checkWin() {
    const safeTotal = numRows * numCols - numMines
    let revealedSafe = 0

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (board[i][j].revealed && !board[i][j].isMine) {
                revealedSafe++
            }
        }
    }

    if (revealedSafe == safeTotal) {
        endGame(true)
        wonGame = true
    }
}
function initBoard() {
    board = []
    for (let i = 0; i < numRows; i++) {
        board[i] = []

        for (let j = 0; j < numCols; j++) {
            board[i][j] = {isMine: false, revealed: false, count: 0, flagged:false, flagCorrect: false, flagWrong:false}
        }
    }
}

function placeMines() {
    let minesPlaced = 0; 

    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * numRows)
        const col = Math.floor(Math.random() * numCols)

        if (!board[row][col].isMine) {
            board[row][col].isMine = true
            minesPlaced++
        }
    }
}

function calcCounts() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (!board[i][j].isMine) {
                board[i][j].count = countAround(i, j)
            }
        }
    }
}

function countAround(row, col) {
    let count = 0
    for (let i = Math.max(row - 1, 0); i < Math.min(row + 2, numRows); i++) {
        for (let j = Math.max(col - 1, 0); j < Math.min(col + 2, numCols); j++) {
            if (!(i === row && j === col) && board[i][j].isMine ) {
                count++
            }
        }
    }

    return count
}

function doNothing(row, col) {
    if (row < 0 || row >= numRows) {
        return true
    } else if (col < 0 || col >= numCols) {
        return true
    }
    return false
}

function revealCell(row, col){
    if (isGameOver || doNothing(row, col) || board[row][col].revealed || board[row][col].flagged) {
        return
    }
    
    board[row][col].revealed = true

    if (board[row][col].isMine) {
        endGame(false)
        return
    } else if (board[row][col].count == 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (!(dx === 0 && dy === 0)) {
                    revealCell(row + dx, col + dy)
                }
            }
        }
    }

    renderBoard()
    checkWin()
}

function placeFlag(row, col) {
    if (isGameOver || doNothing(row, col) || board[row][col].revealed) {
        return
    }
    board[row][col].flagged = !board[row][col].flagged
    renderBoard()
    checkWin()
}

function renderBoard() {
    gameBoard.innerHTML = ""
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div")
            cell.className = "cell"

            if (!isGameOver) {
                if (board[i][j].revealed) {
                    cell.classList.add("revealed")
                    if (board[i][j].isMine) {
                        cell.classList.add("mine")
                        cell.textContent = "M"
                    } else if (board[i][j].count > 0) {
                        cell.textContent = board[i][j].count
                    } 
                } else {
                    if (board[i][j].flagged) {
                        cell.classList.add("flagged")
                        cell.textContent = "F"
                    }
                }
            } else {
                if (board[i][j].revealed) {
                    if (board[i][j].isMine && board[i][j].flagCorrect) {
                        cell.classList.add("flag-correct")
                        cell.textContent = "F"
                    } else if (board[i][j].isMine && board[i][j].flagWrong) {
                        cell.classList.add("flag-wrong")
                        cell.textContent = "F"
                    } else if (board[i][j].count > 0) {
                        cell.textContent = board[i][j].count
                    } else {
                        if (board[i][j].isMine && wonGame) {
                            cell.classList.add("flag-correct")
                            cell.textContent = "F"
                        } else if (board[i][j].isMine && !wonGame) {
                            cell.classList.add("mine")
                            cell.textContent = "M"
                        }
                        
                    }
                } else {
                    if (board[i][j].flagged) {
                        cell.classList.add("flagged")
                        cell.textContent = "F"
                    }
                }
            }

            cell.addEventListener("click", () => revealCell(i, j))
            cell.addEventListener("contextmenu", (e) =>  {
                e.preventDefault()
                placeFlag(i, j)
            })

            if (isGameOver && board[i][j].flagWrong) {
                cell.classList.add("flag-wrong")
                cell.textContent ="F"
            }
            gameBoard.appendChild(cell)
        }
        gameBoard.appendChild(document.createElement("br"))
    }
}
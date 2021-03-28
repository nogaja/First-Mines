'use strict'

const MINE = '💣';
var gMines = [];


function createMines() {
    var emptyCells = getEmptyCells(gBoard)
    while (gMines.length < gLevel.MINES) {
        if (!emptyCells.length) return
        var cell = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
        gMines.push(cell)
        var emptyCellIdx = getCellIdx(cell, emptyCells);
        emptyCells.splice(emptyCellIdx, 1)
    }
    createMine()
}

function createMine() {
    for (var i = 0; i < gMines.length; i++) {
        var row = gMines[i].i
        var col = gMines[i].j
        gBoard[row][col].isMine = true
    }
}

function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCellPos = { i, j };
            var currCell = board[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                emptyCells.push(currCellPos)
            }
        }
    }
    return emptyCells;
}


function getCellIdx(cell, emptyCells) {
    for (var i = 0; i < emptyCells.length; i++) {
        if (emptyCells[i].i === cell.i && emptyCells[i].j === cell.j) {
            return i
        }

    }
}


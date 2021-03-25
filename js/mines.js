'use strict'

const MINE = '🎇';
var gMines = [];
var gFirstCell = [];



function createMines(gFirstCell) {
    while (gMines.length < gLevel.MINES) {

        var row = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var col = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var exist = getMineIdx({ i: row, j: col })
        // bug check also if does'nt exist already
        if (row !== gFirstCell[0] || col !== gFirstCell[1] && !exist) {
            gMines.push({ i: row, j: col })
            createMine(row, col)
        }
    }
}

function createMine(i, j) {
    gBoard[i][j] = MINE
    createCells(gBoard, gLevel.SIZE)
    renderCell({ i: i, j: j }, MINE)
}

function getMineIdx(cell) {
    for (var i = 0; i < gMines.length; i++) {
        if (gMines[i].i === cell.i && gMines[i].j === cell.j) {
            return i
        }
    }
    return null
}
'use strict'

const EMPTY = ' ';
const FLAG = '📍'


var gBoard;
var gCells = [];
var gCell;

var gGame = {
    isOn: false,
    shownCount: 0,
    markeCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

function changeLevel(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    init()
}

function init() {
    gMines=[];
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    printMat(gBoard, '.board-container')
    // createCells(gBoard, gLevel.SIZE)

}


function buildBoard(size, minesNum) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY
        }
    }
    return board
}



function createCell(board, i, j) {
    var gCell = {
        location: {
            i: i,
            j: j
        },
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: true
    }
    gCells.push(gCell)
    if (board[gCell.location.i][gCell.location.j] === MINE) {
        var mineIdx = getCellIdx(i, j)
        gCells[mineIdx].isMine = true;
    }
    else {
        board[gCell.location.i][gCell.location.j] = EMPTY;
        setMinesNegsCount(i, j)
    }
    if (!board[gCell.location.i][gCell.location.j].isShown) {
        var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        elCell.classList.add('hide');
    }
}


function createCells(board, size) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            createCell(board, i, j)
        }
    }

}


function setMinesNegsCount(i, j) {
    var mineNeigs = countAllPossibleNeig({ i: i, j: j }, gBoard)
    renderCell({ i: i, j: j }, mineNeigs)
}

var rightMouseClicked = false;
function cellClicked(elCell, i, j, ev) {
    if (!gGame.isOn) {
        gFirstCell.push(i)
        gFirstCell.push(j)
        createMines(gFirstCell)
    }
    gGame.isOn = true
    // elCell.addEventListener('mouseup', cellClicked)
    var cellIdx = getCellIdx(i, j)
    if (ev.button === 0) {
        gCells[cellIdx].isShown = true;
        elCell.classList.remove('hide');
        console.log(elCell)
    }
    // else if (ev.button===2) {
    //      console.log('ho')
    //     // cellMarked(elCell, i, j, ev)
    // }
}


// function cellMarked(elCell, i, j, ev) {
//     console.log(ev)
//     var cellIdx = getCellIdx(i, j)
//     if (ev.button === 2) {
//         rightMouseClicked = true;
//     }
//     if (rightMouseClicked) {
//         console.log('hello');
//         gCells[cellIdx].isMarked = true;
//         elCell.innerText = FLAG
//     }
// }



// document.addEventListener('mouseup', cellMarked);



function getCellIdx(i, j) {
    for (var d = 0; d < gCells.length; d++) {
        if (gCells[d].location.i === i && gCells[d].location.j === j) {
            return d
        }
    }
    return null
}
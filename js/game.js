'use strict'

const EMPTY = ' ';
const FLAG = '📍'


var gBoard;
var gCells = [];
var gCell;
var gInterval;

var gGame = {
    isOn: false,
    shownCount: 0,
    markCount: 0,
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
    gMines = [];
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard, '.board-container')
    clearInterval(gInterval)
    var timer = document.querySelector('p span')
    timer.innerText = '00:00'
}


function buildBoard(size, minesNum) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY 
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
            //   board[i][j] = cell //instead of EMPTY
        }
    }
    return board
}

// printMat AKA renderBoard //dipslay the board with information from the matrix



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

    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.classList.add('hide');

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

function cellClicked(elCell, i, j, ev) {
    startTimer()

    if (!gGame.isOn) {
        gFirstCell.push(i)
        gFirstCell.push(j)
        createMines(gFirstCell)
    }
    gGame.isOn = true
    var cellIdx = getCellIdx(i, j)

    // gCells[cellIdx].isShown = true;
    if (gCells[cellIdx].isMine) {
        elCell.classList.remove('hide');
        checkGameOver()
        console.log(elCell)
    } else if (elCell.innerText === '0') {
        elCell.classList.remove('hide');
        var shown = expandShown(i, j)
        shown * (gGame.shownCount++);
    } else {
        elCell.classList.remove('hide');
        gGame.shownCount++
    }
    // render the board again

}

function expandShown(i, j) {
    var show = true;
    var res = countAllPossibleNeig({ i: i, j: j }, gBoard, show)
    return res
}

var rightMouseClicked = false;

function cellMarked(elCell, i, j, ev) {
    var inside = elCell.innerText
    console.log(inside)
    console.log(ev)
    var cellIdx = getCellIdx(i, j)
    if (ev.button === 2) {
        rightMouseClicked = true;
        gCells[cellIdx].isMarked = true;
        elCell.innerText = FLAG
        gGame.markCount++
    } else {
        rightMouseClicked = false;
        gCells[cellIdx].isMarked = false;
        console.log(gCells[cellIdx].isMarked)
        elCell.innerText = inside
        gGame.markCount--
    }
    // var elCells = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    // for(var i=0 ; i<elCells.length;i++){
    //     elCells[i].classList.toggle('hide')
    // }

}




function getCellIdx(i, j) {
    for (var d = 0; d < gCells.length; d++) {
        if (gCells[d].location.i === i && gCells[d].location.j === j) {
            return d
        }
    }
    return null
}




function checkGameOver() {
    if (gGame.shownCount === (gLevel.size ** 2) - gLevel.MINES) {
        alert('victory!!!')
    }

}

function startTimer() {
    var timer = document.querySelector('p span')
    var timeSec = 1;
    var timeMil = 0;
    gInterval = setInterval(function () {
        timer.innerText = `${timeSec} secs`
        timeMil++;
        if (timeMil > 100) {
            timeSec++;
            timeMil = 0;
        }
    }, 10)
}




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
    var board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // console.log(board)
    return board
}

function renderBoard(board, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td oncontextmenu= "cellMarked(this , ${i} , ${j}, event)" class="${className}"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this , ${i} , ${j}, event)"
            ></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}




function cellClicked(elCell, i, j, ev) {
    checkEndGame()

    var cell = gBoard[i][j]

    if (!gGame.isOn) {
        gInterval = setInterval(myTimer,1000)
        cell.isShown = true
        gGame.shownCount++
        gGame.isOn = true
        elCell.classList.add('shown')
        createMines()
        var toOpen = expandShown(i, j)
        for (var d = 0; d < toOpen.length; d++) {
            var pos = toOpen[d]
            var i = pos.i
            var j = pos.j
            if (gBoard[i][j].isMine) continue
            var elCell = document.querySelector(`.cell${i}-${j}`)
            cellClicked(elCell, i, j)
        }
        return;
    }


    if (cell.isMine && !cell.isShown) {
        elCell.innerText = MINE
        cell.isShown = true
        // maybe change later:
        checkEndGame(cell.isMine)
        return;
        

    } else if (!cell.isMine && !cell.isShown) {
        cell.minesAroundCount = setMinesNegsCount(i, j)
        cell.isShown = true;
        elCell.innerText = cell.minesAroundCount
        gGame.shownCount++
        if (cell.minesAroundCount === 0) {
            elCell.innerText = ' ';
            var toOpen = expandShown(i, j)
            for (var d = 0; d < toOpen.length; d++) {
                var pos = toOpen[d]
                var i = pos.i
                var j = pos.j
                if (gBoard[i][j].isMine) continue
                var elCell = document.querySelector(`.cell${i}-${j}`)
                cellClicked(elCell, i, j)
            }
        }
    }
    elCell.classList.add('shown')
}
// renderBoard(gBoard ,'.board-container')

function setMinesNegsCount(i, j) {
    var mineNeigs = countAllPossibleNeig({ i: i, j: j }, gBoard)
    return mineNeigs
}


function cellMarked(elCell, i, j, ev) {
    if (gBoard[i][j].isShown) return;
    var flagged = elCell.innerText
    if (ev.button === 2 && !flagged) {
        gBoard[i][j].isMarked = true;
        gGame.markCount += 1;
        elCell.innerText = FLAG;
    } else if (ev.button == 2 && flagged) {
        gBoard[i][j].isMarked = false;
        gGame.markCount -= 1;
        elCell.innerText = ''
    }

}

function expandShown(i, j) {
    var show = true;
    var res = countAllPossibleNeig({ i: i, j: j }, gBoard, show)
    return res
}

function checkEndGame(mine) {
    if (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) {
        console.log('victory!!!')
        clearInterval(gInterval)
    }else if (mine){
        console.log ('You lost...Try again')
        clearInterval(gInterval)
    } 
}

function myTimer(){
    gGame.secsPassed++
    var timer = document.querySelector('p span')
    timer.innerText = ` ${gGame.secsPassed}`

}



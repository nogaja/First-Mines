'use strict'

const FLAG = '🚩'
const NORMAL = '😃'
const SAD = '🤯'
const CHAMP = '👑'
const HINT = 'images/light-off.png'
const HINTUSED = 'images/light-on.png'



var gBoard;
var gCells = [];
var gCell;
var gInterval;
var gGameEnd = false;
var gHint = false;


var gGame = {
    isOn: false,
    shownCount: 0,
    markCount: 0,
    secsPassed: 0,
    lives: 3
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
    gGameEnd = false;
    gGame.shownCount = 0;
    gGame.markCount = 0;
    gGame.secsPassed = 0;
    gGame.lives = 3;
    var elLives = document.querySelector('.lives span')
    elLives.innerText = `${gGame.lives}`
    elLives.style.color = 'blanchedalmond'
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard, '.board-container')
    clearInterval(gInterval)
    var timer = document.querySelector('p span')
    timer.innerText = '00:00'
    var elFace = document.querySelector('.face')
    elFace.innerText = NORMAL;
    // all +loop?
    var elHint1 = document.querySelector('.hint1')
    elHint1.src = HINT;
    var elHint2 = document.querySelector('.hint2')
    elHint2.src = HINT;
    var elHint3 = document.querySelector('.hint3')
    elHint3.src = HINT;

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
    var elFace = document.querySelector('.face')
    elFace.innerText = NORMAL;
    checkEndGame()
    if (gGameEnd) return;
    var cell = gBoard[i][j]
    if (!gGame.isOn) {
        gInterval = setInterval(myTimer, 1000)
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
            checkEndGame()
        }
        return;
    }

    // if (gGame.isOn && gHint && ev) {
    //     gHint = false;
    //     var toOpen = expandShown(i, j)
        
    //     for (var d = 0; d < toOpen.length; d++) {
    //         var pos = toOpen[d]
    //         var i = pos.i
    //         var j = pos.j
    //         var elCell = document.querySelector(`.cell${i}-${j}`)
    //         elCell.classList.add('shown')
    //         cellClicked(elCell, i, j)
            
    //     }
    //     setTimeout(function () {
    //         for (var d = 0; d < toOpen.length; d++) {
    //             var pos = toOpen[d]
    //             var i = pos.i
    //             var j = pos.j
    //             var elCell = document.querySelector(`.cell${i}-${j}`)
    //             elCell.classList.remove('shown')
                
    //         }
            
    //     }, 1000);
    //     return;
    // }


    if (cell.isMine && !cell.isShown) {
        elCell.innerText = MINE
        cell.isShown = true
        elCell.classList.add('shown')

        if (gGame.lives !== 0) {
            setTimeout(function () {
                elCell.innerText = ' '
                cell.isShown = false
                elCell.classList.remove('shown')
                elFace.innerText = SAD;
            }, 1000);
        }
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
    checkEndGame()

}


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
        checkEndGame()
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
    if (gGame.shownCount === ((gLevel.SIZE ** 2) - gLevel.MINES) && gGame.markCount === gLevel.MINES) {
        clearInterval(gInterval)
        console.log('Victory!!!')
        var elFace = document.querySelector('.face')
        elFace.innerText = CHAMP;
        gGameEnd = true
    } else if (mine) {
        gGame.lives--
        var elLives = document.querySelector('.lives span')
        elLives.style.color = 'red'
        elLives.innerText = `${gGame.lives}`
        if (gGame.lives === 0) {
            lost()
            clearInterval(gInterval)
            gGameEnd = true
        }
    }
}

function getHint(elHint) {
    gHint = true;
    elHint.src = HINTUSED;
}

function lost() {
    for (var i = 0; i < gMines.length; i++) {
        var row = gMines[i].i
        var col = gMines[i].j
        var elCell = document.querySelector(`.cell${row}-${col}`)
        elCell.innerText = MINE
        elCell.classList.add('lost')
        var elFace = document.querySelector('.face')
        elFace.innerText = SAD;
    }
}

function myTimer() {
    gGame.secsPassed++
    var timer = document.querySelector('p span')
    timer.innerText = ` ${gGame.secsPassed}`
}



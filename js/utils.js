'use strict'



function  renderBoard(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td oncontextmenu= "cellMarked(this , ${i} , ${j}, event)" class="${className}"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(this , ${i} , ${j}, event)"
            ><span>${cell}</span></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    // console.log(strHTML)
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// location such as: {i: 2, j: 7}
function countAllPossibleNeig(location, board,show) {
    var count = 0;
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i === location.i && j === location.j) continue;
            if (j < 0 || j > board[0].length - 1) continue;
            var cell = board[i][j]
            if (cell === MINE) count++
            if(show) {
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.classList.remove('hide')
            }
            
        }
    }
    return count
}







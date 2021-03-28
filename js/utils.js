'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// location such as: {i: 2, j: 7}
function countAllPossibleNeig(location, board, show) {
    var toBeOpened = []
    var count = 0;
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (i === location.i && j === location.j) continue;
            if (j < 0 || j > board[0].length - 1) continue;
            var cell = board[i][j]
            if (cell.isMine === true) count++
            if (show) {
               toBeOpened.push({ i: i, j: j })
            }
        }
    }
    if(show) return toBeOpened
    return count
}







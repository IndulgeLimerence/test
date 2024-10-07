var board = []; 
var score = 0; 
var hasConflicted = []; 
let preValue = [];
let preScore = [];

$(function () {
    newgame();
})


function newgame() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid_cell_" + i + "_" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j)); 
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    generateOneNumber(); 
    generateOneNumber();

    score = 0; 
    updateScore(score);
}

function updateBoardView() {
    $(".number_cell").remove(); 
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid_container").append("<div class='number_cell' id='number_cell_" + i + "_" + j + "'>"); 
            var theNumberCell = $("#number_cell_" + i + "_" + j); 
            if (board[i][j] == 0) {
                theNumberCell.css("width", "0");
                theNumberCell.css("height", "0");
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
            } else {
                theNumberCell.css("width", "100px");
                theNumberCell.css("height", "100px");
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j])); 
                theNumberCell.css("color", getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]); 
            }
            hasConflicted[i][j] = false;
        }
    }
}

function undo() {
    let obj = {};
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (obj[board[i][j]]) {
                obj[board[i][j]]++;
            } else {
                obj[board[i][j]] = 1;
            }
        }
    }
    for (let key in obj) {
        if (key == 0 && obj[key] == 14) {
            return false;
        }
    }
    for (let i = 3; i >= 0; i--) {
        for (let j = 3; j >= 0; j--) {
            board[i][j] = preValue.pop();
        }
    }
    score = preScore.pop();
    updateBoardView();
    updateScore(score);
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    } else {
        var randx = parseInt(Math.floor(Math.random() * 4));
        var randy = parseInt(Math.floor(Math.random() * 4));
        var times = 0;
        while (times < 50) {
            if (board[randx][randy] == 0) {
                break; 
            } else {
                randx = parseInt(Math.floor(Math.random() * 4));
                randy = parseInt(Math.floor(Math.random() * 4));
            }
            times++;
        }
        if (times == 50) {
            for (var i = 0; i < 4; i++) { 
                for (var j = 0; j < 4; j++) {
                    if (board[i][j] == 0) {
                        randx = i;
                        randy = j;
                    }
                }
            }
        }
        var randNumber = Math.random() < 0.5 ? 2 : 4; 
        board[randx][randy] = randNumber;
        showNumberWithAnimation(randx, randy, randNumber); 
        return true;
    }
}

$(document).keydown(function (event) {
    switch (event.keyCode) { 
        case 37: 
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: 
            if (moveTop()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: 
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: 
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default:
            break;
    }
})

function isgameover() {
    if (nospace(board) && nomove(board)) {
        alert("game over");
    }
}

function moveLeft() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);
    if (canMoveLeft(board)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < j; k++) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) { 
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                            showMoveAnimation(i, j, i, k);
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score += board[i][k]; 
                            updateScore(score); 
                            hasConflicted[i][k] = true; 
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    } else {
        return false;
    }
}

function moveRight() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);
    if (canMoveRight(board)) {
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > j; k--) {
                        if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                            showMoveAnimation(i, j, i, k);
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score += board[i][k];
                            updateScore(score);
                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    } else {
        return false;
    }
}

function moveDown() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);
    if (canMoveDown(board)) {
        for (var i = 2; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 3; k > i; k--) {
                        if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateScore(score);
                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    } else {
        return false;
    }
}

function moveTop() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            preValue.push(board[i][j]);
        }
    }
    preScore.push(score);
    if (canMoveTop(board)) {
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] != 0) {
                    for (var k = 0; k < i; k++) {
                        if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            
                            score += board[k][j];
                            updateScore(score);
                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()", 200);
        return true;
    } else {
        return false;
    }
}
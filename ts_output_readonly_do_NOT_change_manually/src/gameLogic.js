/*angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices']).factory('gameLogic', function() {
  'use strict';*/
/**
 * Returns the initial Blokus board, which is a 20 * 20 matrix containing ''.
 */
var gameLogic;
(function (gameLogic) {
    function getInitialBoard() {
        return [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                '', '', '', '']];
    }
    gameLogic.getInitialBoard = getInitialBoard;
    function getInitialFreeShapes() {
        return [[true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]];
    }
    gameLogic.getInitialFreeShapes = getInitialFreeShapes;
    function getInitialPlayerStatus() {
        return [true, true, true, true];
    }
    gameLogic.getInitialPlayerStatus = getInitialPlayerStatus;
    function getPossibleMoves(state, turnIndex) {
        var possibleMoves = getPossibleMovesWithSqaureN(state, turnIndex, 5);
        if (possibleMoves.length > 0) {
            return possibleMoves;
        }
        else {
            possibleMoves = getPossibleMovesWithSqaureN(state, turnIndex, 4);
            if (possibleMoves.length > 0) {
                return possibleMoves;
            }
            else {
                return getPossibleMovesWithSqaureN(state, turnIndex, 3);
            }
        }
    }
    gameLogic.getPossibleMoves = getPossibleMoves;
    function traverseBoard() {
        var row_col = [];
        var num = 1;
        var i;
        var j;
        for (var level = 9; level >= 0; level--) {
            i = level;
            j = level;
            // going right;
            for (; j < level + num; j++) {
                row_col.push([i, j]);
            }
            // going down
            for (; i < level + num; i++) {
                row_col.push([i, j]);
            }
            // going left
            for (; j > level; j--) {
                row_col.push([i, j]);
            }
            // going up
            for (; i > level; i--) {
                row_col.push([i, j]);
            }
            num += 2;
        }
        return row_col;
    }
    gameLogic.traverseBoard = traverseBoard;
    function shuffle(array) {
        var n = array.length;
        for (var i = 0; i < n; i++) {
            // choose index uniformly in [i, n-1]
            var r = i + Math.floor((Math.random() * (n - i)));
            var swap = array[r];
            array[r] = array[i];
            array[i] = swap;
        }
        return array;
    }
    gameLogic.shuffle = shuffle;
    /*return the possible moves which places a n-square shape*/
    function getPossibleMovesWithSqaureN(state, turnIndex, n) {
        var shapes = [];
        var possibleMoves = [];
        var freeShapes = state.freeShapes;
        var board = state.board;
        var count = 0;
        if (n === 5) {
            shapes = shuffle([4, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20]); // shapes with 5 squares;
        }
        else if (n === 4) {
            shapes = shuffle([3, 6, 7, 8, 14]); // shapes with four squares;
        }
        else {
            shapes = shuffle([0, 1, 2, 5]); // shapes with less than 4 squares;
        }
        var row_col = traverseBoard();
        for (var h = 0; h < row_col.length && count < 1; h++) {
            var i = row_col[h][0];
            var j = row_col[h][1];
            if (board[i][j] !== '') {
                continue;
            }
            if (squareEdgeConnected(board, i, j, turnIndex)) {
                continue;
            }
            for (var k = 0; k < shapes.length && count < 1; k++) {
                var shape = shapes[k];
                if (!freeShapes[turnIndex][shape]) {
                    continue;
                }
                var rotations = shuffle(getPossibleRotations(shape));
                for (var r = 0; r < rotations.length && count < 1; r++) {
                    // there are total 8 possible rotations
                    var placement = getPlacement(i, j, shape, r);
                    if (legalPlacement(board, placement, turnIndex) && count < 1) {
                        possibleMoves.push(createMove(state, placement, shape, turnIndex));
                        count++;
                    }
                }
            }
        }
        return possibleMoves;
    }
    gameLogic.getPossibleMovesWithSqaureN = getPossibleMovesWithSqaureN;
    /*return true if the rotation is valid for the shape*/
    function isValidRotation(shape, r) {
        // there are total 8 rotations: rotate clockwise by 0, 90, 180, 270 degress. Mirrow the shape, and rotate clockwise by 0, 90, 180, 270 degrees.
        // a rotation is valid only if the rotated shape is unique
        if (shape === 0 || shape === 8 || shape === 19) {
            return r === 0;
        }
        if (shape === 1 || shape === 2 || shape === 3 || shape === 4) {
            return r === 0 || r === 1;
        }
        if (shape === 5 || shape === 10 || shape === 11 || shape === 14 || shape === 16 || shape === 17) {
            return r === 0 || r === 1 || r === 2 || r === 3;
        }
        if (shape === 7 || shape === 13) {
            return r === 0 || r === 1 || r === 4 || r === 5;
        }
        if (shape === 6 || shape === 9 || shape === 12 || shape === 15 || shape === 18 || shape === 20) {
            return true;
        }
        return false;
    }
    gameLogic.isValidRotation = isValidRotation;
    /*return the possible rotations for a given shape*/
    function getPossibleRotations(shape) {
        var rotations = [];
        if (shape === 0 || shape === 8 || shape === 19) {
            rotations.push(0);
        }
        if (shape === 1 || shape === 2 || shape === 3 || shape === 4) {
            rotations.push(0, 1);
        }
        if (shape === 5 || shape === 10 || shape === 11 || shape === 14 || shape === 16 || shape === 17) {
            rotations.push(0, 1, 2, 3);
        }
        if (shape === 7 || shape === 13) {
            rotations.push(0, 1, 4, 5);
        }
        if (shape === 6 || shape === 9 || shape === 12 || shape === 15 || shape === 18 || shape === 20) {
            rotations.push(0, 1, 2, 3, 4, 5, 6, 7);
        }
        return rotations;
    }
    gameLogic.getPossibleRotations = getPossibleRotations;
    function createMove(stateBeforeMove, placement, shape, turnIndexBeforeMove) {
        var tmpIndex = turnIndexBeforeMove;
        // example move = {setTurn(2), setBoard([[...]]), setPlayerStatus(true,
        // false, true, true), setFreeShapes([...],[...],[...],[...])};
        if (stateBeforeMove === undefined || stateBeforeMove.board === undefined) {
            stateBeforeMove = {
                board: getInitialBoard(),
                playerStatus: getInitialPlayerStatus(),
                freeShapes: getInitialFreeShapes(),
                delta: {} };
        }
        var board = stateBeforeMove.board;
        var playerStatus = stateBeforeMove.playerStatus;
        var freeShapes = stateBeforeMove.freeShapes;
        if (!legalPlacement(board, placement, turnIndexBeforeMove)) {
            throw new Error("illegal placement of a shape!");
        }
        if (endOfMatch(playerStatus)) {
            throw new Error("Can only make a move if the game is not over!");
        }
        // set up the board after move
        var boardAfterMove = angular.copy(board);
        var label = turnIndexBeforeMove.toString();
        for (var i = 0; i < placement.length; i++) {
            var row = placement[i][0];
            var col = placement[i][1];
            boardAfterMove[row][col] = label;
        }
        var freeShapesAfterMove = updateFreeShapes(turnIndexBeforeMove, freeShapes, shape);
        var playerStatusAfterMove = updatePlayerStatus(boardAfterMove, freeShapesAfterMove, playerStatus);
        var firstOperation = updateTurnIndex(turnIndexBeforeMove, playerStatusAfterMove, freeShapesAfterMove);
        return [firstOperation,
            { set: {
                    key: 'board',
                    value: boardAfterMove
                } },
            { set: {
                    key: 'playerStatus',
                    value: playerStatusAfterMove
                } },
            { set: {
                    key: 'freeShapes',
                    value: freeShapesAfterMove
                } },
            { set: {
                    key: 'delta',
                    value: {
                        shape: shape,
                        placement: placement
                    }
                } },
            { set: {
                    key: 'internalTurnIndex',
                    value: getInternalTurnIndex()
                } },
            { set: {
                    key: 'lastIndex',
                    value: tmpIndex
                } }
        ];
    }
    gameLogic.createMove = createMove;
    function isMoveOk(params) {
        var move = params.move;
        console.log(params);
        var stateBeforeMove = params.stateBeforeMove;
        // let turnIndexBeforeMove = params.turnIndexBeforeMove;
        var last = move[6].set.value;
        //console.log("turnIndexBeforeMove +" + turnIndexBeforeMove);
        try {
            var shape = move[4].set.value.shape;
            var placement = move[4].set.value.placement;
            var expectedMove = createMove(stateBeforeMove, placement, shape, last);
            expectedMove[6].set.value = last;
            console.log("expected move: ");
            console.log(expectedMove);
            if (!angular.equals(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
    /** return the updated state.freeShapes after a move is completed */
    function updateFreeShapes(turnIndexBeforeMove, freeShapes, shape) {
        var freeShapesAfterMove = angular.copy(freeShapes);
        if (freeShapesAfterMove[turnIndexBeforeMove][shape] == false) {
            throw new Error("the shape is already used by the player!");
        }
        else {
            freeShapesAfterMove[turnIndexBeforeMove][shape] = false;
        }
        return freeShapesAfterMove;
    }
    gameLogic.updateFreeShapes = updateFreeShapes;
    /** return number of players who are */
    /** check whether the current player can make a move using shape available */
    function canMove(board, freeShapes, turnIndex) {
        if (isFirstMove(board, turnIndex)) {
            return true;
        }
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++) {
                if (board[i][j] !== '') {
                    continue;
                }
                if (squareEdgeConnected(board, i, j, turnIndex)) {
                    continue;
                }
                for (var shape = 0; shape < 21; shape++) {
                    if (!freeShapes[turnIndex][shape]) {
                        continue;
                    }
                    for (var r = 0; r < 8; r++) {
                        if (!isValidRotation(shape, r)) {
                            continue;
                        }
                        var placement = getPlacement(i, j, shape, r);
                        if (placementInBound(board, placement) && !isOccupied(board, placement) &&
                            !edgeConnected(board, placement, turnIndex) && cornerConnected(board, placement, turnIndex)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    gameLogic.canMove = canMove;
    /** return the updated state.playerStatus after a move is completed */
    function updatePlayerStatus(boardAfterMove, freeShapes, playerStatus) {
        var playerStatusAfterMove = angular.copy(playerStatus);
        // a player dies when used up all the shapes
        for (var i = 0; i < 4; i++) {
            if (shapeUsedUp(i, freeShapes)) {
                playerStatusAfterMove[i] = false;
            }
        }
        // a player dies when the player cannot make a legal move using the remaining shapes
        for (var i = 0; i < 4; i++) {
            // skip dead player
            if (!playerStatusAfterMove[i]) {
                continue;
            }
            playerStatusAfterMove[i] = canMove(boardAfterMove, freeShapes, i);
        }
        return playerStatusAfterMove;
    }
    gameLogic.updatePlayerStatus = updatePlayerStatus;
    /** return true if player i used up all the shapes*/
    function shapeUsedUp(turnIndex, freeShapes) {
        for (var shape = 0; shape < 21; shape++) {
            if (freeShapes[turnIndex][shape]) {
                return false;
            }
        }
        return true;
    }
    gameLogic.shapeUsedUp = shapeUsedUp;
    /*global  letiable*/
    var nextPlayer = 0;
    /** update updateTurnIndex after a move is completed */
    function updateTurnIndex(turnIndexBeforeMove, playerStatusAfterMove, freeShapes) {
        var firstOperation = {};
        if (endOfMatch(playerStatusAfterMove)) {
            firstOperation = {
                endMatch: {
                    endMatchScores: getScore(freeShapes)
                }
            };
        }
        else {
            nextPlayer = (turnIndexBeforeMove + 1) % 4;
            // find the next alive player
            while (playerStatusAfterMove[nextPlayer] === false) {
                nextPlayer = (nextPlayer + 1) % 4;
            }
            firstOperation = {
                setTurn: {
                    //turnIndex : nextPlayer
                    turnIndex: Math.floor(nextPlayer / 2)
                }
            };
        }
        return firstOperation;
    }
    gameLogic.updateTurnIndex = updateTurnIndex;
    /** return true if all the players die */
    function endOfMatch(playerStatus) {
        for (var i = 0; i < playerStatus.length; i++) {
            if (playerStatus[i]) {
                return false;
            }
        }
        return true;
    }
    gameLogic.endOfMatch = endOfMatch;
    /** implemented later */
    function getScore(freeShapes) {
        var score = [0, 0, 0, 0];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 21; j++) {
                if (!freeShapes[i][j]) {
                    if (j === 0) {
                        score[i] += 1;
                    }
                    if (j === 1) {
                        score[i] += 2;
                    }
                    if (j === 2 || j === 5) {
                        score[i] += 3;
                    }
                    if (j === 3 || j === 6 || j === 7 || j === 8 || j === 14) {
                        score[i] += 4;
                    }
                    if (j === 4 || j === 9 || j === 10 || j === 11 || j === 12
                        || j === 13 || j === 15 || j === 16
                        || j === 18 || j === 19 || j === 20) {
                        score[i] += 5;
                    }
                }
            }
            if (shapeUsedUp(i, freeShapes)) {
                score[i] += 20;
            }
            console.log(score);
        }
        // If a player played all of his or her pieces, he or she gets a bonus score of +20 points
        return [score[0] + score[1], score[2] + score[3]];
    }
    gameLogic.getScore = getScore;
    /** check whether a board cell is in bound of the board */
    function inBounds(board, row, col) {
        return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
    }
    gameLogic.inBounds = inBounds;
    /** check whether the board square has an edge connection to another square of the same player 03/22 */
    function squareCornerConnected(board, row, col, turnIndex) {
        var label = turnIndex.toString();
        if (inBounds(board, row + 1, col + 1) && board[row + 1][col + 1] === label ||
            inBounds(board, row + 1, col - 1) && board[row + 1][col - 1] === label ||
            inBounds(board, row - 1, col + 1) && board[row - 1][col + 1] === label ||
            inBounds(board, row - 1, col - 1) && board[row - 1][col - 1] === label) {
            return true;
        }
        else {
            return false;
        }
    }
    gameLogic.squareCornerConnected = squareCornerConnected;
    /** check whether the placement is contains corner-to-corner connections */
    function cornerConnected(board, placement, turnIndex) {
        for (var i = 0; i < placement.length; i++) {
            var label = turnIndex.toString();
            var row = placement[i][0];
            var col = placement[i][1];
            if (squareCornerConnected(board, row, col, turnIndex)) {
                return true;
            }
        }
        return false;
    }
    gameLogic.cornerConnected = cornerConnected;
    /** check whether the board square has an edge connection to another square of the same player 03/22 */
    function squareEdgeConnected(board, row, col, turnIndex) {
        var label = turnIndex.toString();
        if (inBounds(board, row + 1, col) && board[row + 1][col] === label ||
            inBounds(board, row - 1, col) && board[row - 1][col] === label ||
            inBounds(board, row, col + 1) && board[row][col + 1] === label ||
            inBounds(board, row, col - 1) && board[row][col - 1] === label) {
            return true;
        }
        else {
            return false;
        }
    }
    gameLogic.squareEdgeConnected = squareEdgeConnected;
    /** check whether the placement contains edge-to-edge connections */
    function edgeConnected(board, placement, turnIndex) {
        for (var i = 0; i < placement.length; i++) {
            var label = turnIndex.toString();
            var row = placement[i][0];
            var col = placement[i][1];
            if (squareEdgeConnected(board, row, col, turnIndex)) {
                return true;
            }
        }
        return false;
    }
    gameLogic.edgeConnected = edgeConnected;
    /** check whether the placement is already occupied by other squares */
    function isOccupied(board, placement) {
        var i;
        for (i = 0; i < placement.length; i++) {
            var row = placement[i][0];
            var col = placement[i][1];
            if (board[row][col] !== '') {
                return true;
            }
        }
        return false;
    }
    gameLogic.isOccupied = isOccupied;
    /** check whether the placement is in bound of the board */
    function placementInBound(board, placement) {
        for (var i = 0; i < placement.length; i++) {
            var row = placement[i][0];
            var col = placement[i][1];
            if (!inBounds(board, row, col)) {
                return false;
            }
        }
        return true;
    }
    gameLogic.placementInBound = placementInBound;
    function isFirstMove(board, turnIndex) {
        var label = turnIndex.toString();
        if (board[0][0] === label || board[0][19] === label || board[19][0] === label || board[19][19] === label) {
            return false;
        }
        return true;
    }
    gameLogic.isFirstMove = isFirstMove;
    function legalPlacement(board, placement, turnIndex) {
        if (isFirstMove(board, turnIndex)) {
            for (var i = 0; i < placement.length; i++) {
                if (angular.equals(placement[i], [0, 0]) || angular.equals(placement[i], [0, 19]) ||
                    angular.equals(placement[i], [19, 0]) || angular.equals(placement[i], [19, 19])) {
                    return placementInBound(board, placement)
                        && !isOccupied(board, placement);
                }
            }
            return false;
        }
        else {
            return placementInBound(board, placement)
                && !isOccupied(board, placement)
                && !edgeConnected(board, placement, turnIndex)
                && cornerConnected(board, placement, turnIndex);
        }
    }
    gameLogic.legalPlacement = legalPlacement;
    function getPlacement(row, col, shape, r) {
        var placement = [];
        switch (shape) {
            case 0:
                placement.push([row, col]);
                break;
            case 1:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col]);
                }
                if (r === 1) {
                    placement.push([row, col - 1], [row, col]);
                }
                break;
            case 2:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row - 2, col]);
                }
                if (r === 1) {
                    placement.push([row, col - 2], [row, col - 1], [row, col]);
                }
                break;
            case 3:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [
                        row - 3, col]);
                }
                if (r === 1) {
                    placement.push([row, col - 3], [row, col - 2], [row, col - 1], [row, col]);
                }
                break;
            case 4:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [
                        row - 3, col], [row - 4, col]);
                }
                if (r === 1) {
                    placement.push([row, col - 4], [row, col - 3], [row, col - 2], [row, col - 1], [row, col]);
                }
                break;
            case 5:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row, col - 1]);
                }
                break;
            case 6:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row + 1, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 2, col - 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [
                        row - 1, col]);
                }
                if (r === 4) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [
                        row, col - 1]);
                }
                if (r === 5) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 2]);
                }
                if (r === 6) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1]);
                }
                if (r === 7) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 1, col - 2]);
                }
                break;
            case 7:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 1, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 4) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 1, col - 2]);
                }
                if (r === 5) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row + 1, col - 1]);
                }
                break;
            case 8:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row - 1, col - 1]);
                }
                break;
            case 9:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row - 1, col - 3]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1], [row + 3, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 1, col - 2], [row - 1, col - 3]);
                }
                if (r === 3) {
                    placement.push([row, col], [row, col - 1], [row - 1, col], [
                        row - 2, col], [row - 3, col]);
                }
                if (r === 4) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [
                        row, col - 2], [row, col - 3]);
                }
                if (r === 5) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1], [row - 3, col - 1]);
                }
                if (r === 6) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row + 1, col - 3]);
                }
                if (r === 7) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 3, col], [row - 3, col - 1]);
                }
                break;
            case 10:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 2], [row + 1, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 2, col - 1], [row - 2, col + 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 1, col - 1], [row - 1, col - 2]);
                }
                break;
            case 11:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 2], [row - 2, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row + 1, col - 2], [row + 2, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 2, col - 1], [row - 2, col - 2]);
                }
                if (r === 3) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [
                        row - 1, col], [row - 2, col]);
                }
                break;
            case 12:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row + 1, col - 2], [row + 1, col - 3]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 2, col - 1], [row - 3, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 1, col - 2], [row + 1, col - 3]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 2, col - 1], [row - 3, col - 1]);
                }
                if (r === 4) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 1, col - 2], [row - 1, col - 3]);
                }
                if (r === 5) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [
                        row, col - 1], [row + 1, col - 1]);
                }
                if (r === 6) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 2], [row - 1, col - 3]);
                }
                if (r === 7) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1]);
                }
                break;
            case 13:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row, col - 2], [row + 1, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1], [row - 2, col - 2]);
                }
                if (r === 4) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 1, col - 2], [row - 2, col - 2]);
                }
                if (r === 5) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1], [row + 2, col - 2]);
                }
                break;
            case 14:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 1]);
                }
                if (r === 1) {
                    placement.push([row, col], [row + 1, col - 1], [row, col - 1], [row - 1, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row + 1, col - 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 1, col - 1]);
                }
                break;
            case 15:
                if (r === 0) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row - 1, col - 1], [row - 1, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row, col - 1], [row - 1, col], [row - 1, col - 1], [row - 2, col]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col - 1], [row, col - 1], [row - 1, col - 2], [row, col - 2]);
                }
                if (r === 4) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 5) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row, col - 1], [row, col - 2]);
                }
                if (r === 6) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 7) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row + 1, col - 1], [row + 1, col - 2]);
                }
                break;
            case 16:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 1, col - 2], [row + 2, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 2, col - 1], [row - 2, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row + 1, col - 1], [row + 1, col - 2]);
                }
                if (r === 3) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 1, col - 2], [row - 2, col - 2]);
                }
                break;
            case 17:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1], [row - 2, col]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 1, col - 2], [row, col - 2]);
                }
                if (r === 2) {
                    placement.push([row, col], [row, col - 1], [row - 1, col], [row - 2, col], [row - 2, col - 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row, col - 2], [row - 1, col - 2]);
                }
                break;
            case 18:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1], [row + 1, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col], [row - 1, col - 1], [row - 1, col - 2], [row - 2, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1], [row + 1, col - 2]);
                }
                if (r === 3) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 2], [row + 1, col - 1]);
                }
                if (r === 4) {
                    placement.push([row, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1], [row - 1, col - 2]);
                }
                if (r === 5) {
                    placement.push([row, col], [row - 1, col], [row, col - 1], [row, col - 2], [row + 1, col - 1]);
                }
                if (r === 6) {
                    placement.push([row, col], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1], [row - 1, col - 2]);
                }
                if (r === 7) {
                    placement.push([row, col], [row - 1, col - 1], [row, col - 1], [row, col - 2], [row + 1, col - 2]);
                }
                break;
            case 19:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row - 1, col - 1], [row + 1, col - 1]);
                }
                break;
            case 20:
                if (r === 0) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row - 1, col - 2]);
                }
                if (r === 1) {
                    placement.push([row, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1], [row + 2, col - 1]);
                }
                if (r === 2) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row + 1, col - 1]);
                }
                if (r === 3) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 3, col], [row - 1, col - 1]);
                }
                if (r === 4) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row - 1, col - 1]);
                }
                if (r === 5) {
                    placement.push([row, col], [row + 1, col - 1], [row, col - 1], [row - 1, col - 1], [row - 2, col - 1]);
                }
                if (r === 6) {
                    placement.push([row, col], [row, col - 1], [row, col - 2], [row, col - 3], [row + 1, col - 2]);
                }
                if (r === 7) {
                    placement.push([row, col], [row - 1, col], [row - 2, col], [row - 3, col], [row - 2, col - 1]);
                }
                break;
        }
        return placement;
    }
    gameLogic.getPlacement = getPlacement;
    function getInternalTurnIndex() {
        return nextPlayer;
    }
    gameLogic.getInternalTurnIndex = getInternalTurnIndex;
})(gameLogic || (gameLogic = {}));
/*angular.module('myApp', [ 'ngTouch', 'ui.bootstrap','gameServices'])
    .factory('gameLogic', function() {
     return {
         getScore: gameLogic.getScore,
      endOfMatch: gameLogic.endOfMatch,
         getInitialBoard: gameLogic.getInitialBoard,
      getInitialFreeShapes: gameLogic.getInitialFreeShapes,
      getInitialPlayerStatus: gameLogic.getInitialPlayerStatus,
         createMove: gameLogic.createMove,
         isMoveOk: gameLogic.isMoveOk,
         legalPlacement: gameLogic.legalPlacement,
      getPlacement: gameLogic.getPlacement,
         getPossibleMoves: gameLogic.getPossibleMoves,
      isOccupied: gameLogic.isOccupied,
      placementInBound: gameLogic.placementInBound,
      getPossibleMovesWithSqaureN: gameLogic.getPossibleMovesWithSqaureN,
      getInternalTurnIndex : gameLogic.getInternalTurnIndex
     };
});*/

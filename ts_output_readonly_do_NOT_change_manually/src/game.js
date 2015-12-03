var game;
(function (game) {
    var state = null;
    var board = null;
    game.shape = -1;
    var preview;
    var turnIndex = 0;
    var isYourTurn = true;
    var internalTurnIndex = 0;
    //let getRotateAreaSquareColor: any;
    game.rotate = -1;
    var animationEnded = true;
    var isComputerTurn = true;
    var gameArea;
    var draggingLines;
    var verticalDraggingLine;
    var horizontalDraggingLine;
    function init() {
        console.log("Translation of 'RULES_OF_BLOKUS' is " + translate('RULES_OF_BLOKUS'));
        resizeGameAreaService.setWidthToHeight(0.6);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
        // See http://www.sitepoint.com/css3-animation-javascript-event-handlers/
        document.addEventListener("animationend", animationEndedCallback, false); // standard
        document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
        document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
        gameArea = document.getElementById("gameArea");
    }
    game.init = init;
    function animationEndedCallback() {
        $rootScope.$apply(function () {
            log.info("Animation ended");
            animationEnded = true;
            if (isComputerTurn) {
                sendComputerMove();
            }
        });
    }
    /*set background color of boardArea square when dragging */
    function setSquareBackgroundColor(row, col, color) {
        document.getElementById('e2e_test_board_div_' + row + 'x' + col).style.background = color;
    }
    /*set background color of boardArea when dragging*/
    function setBoardBackgroundColor() {
        var num = getRowColNum('board');
        for (var row = 0; row < num.rowsNum; row++) {
            for (var col = 0; col < num.colsNum; col++) {
                setSquareBackgroundColor(row, col, getBoardSquareColor(row, col));
            }
        }
    }
    /*set the style for boardArea square*/
    game.setBoardAreaSquareStyle = function (row, col) {
        var color = getBoardSquareColor(row, col);
        return { background: color };
    };
    /*return the square color on the boardArea. Red, green, blue, yellow for player0, 1, 2, 3. Grey for empty board square*/
    function getBoardSquareColor(row, col) {
        if (state.board[row][col] === '0') {
            return '#33CCFF';
        }
        else if (state.board[row][col] === '1') {
            return '#FF9900';
        }
        else if (state.board[row][col] === '2') {
            return '#FF3399';
        }
        else if (state.board[row][col] === '3') {
            return '#99FF33';
        }
        else {
            return '#F0F0F0';
        }
    }
    function getTurnColor() {
        var color = ['#33CCFF', '#FF9900', '#FF3399', '#99FF33'];
        return color[internalTurnIndex]; // changed turnIndex 05/19
    }
    function setPlacementBackgroundColor(placement) {
        for (var i = 0; i < placement.length; i++) {
            var row = placement[i][0];
            var col = placement[i][1];
            setSquareBackgroundColor(row, col, getTurnColor());
        }
    }
    function clearDrag(dragType) {
        if (dragType === 'board') {
            // reset boardArea background color;
            for (var i = 0; i < preview.length; i++) {
                var row = preview[i][0];
                var col = preview[i][1];
                setSquareBackgroundColor(row, col, getBoardSquareColor(row, col));
            }
        }
        var draggingLines = document.getElementById(dragType + "DraggingLines");
        draggingLines.style.display = "none";
    }
    //dragAndDropService.addDragListener("gameArea", handleDragEvent);
    function getAreaSize(type) {
        var area = document.getElementById(type + "Area");
        return { width: area.clientWidth, height: area.clientHeight };
    }
    /*return true if the board square row X col is newly added, used for animation*/
    game.newlyPlaced = function (row, col) {
        /*for the initial state, there is no newly added square*/
        if (state.delta === undefined) {
            return false;
        }
        var lastPlacement = state.delta.placement;
        for (var i = 0; i < lastPlacement.length; i++) {
            if (lastPlacement[i][0] === row && lastPlacement[i][1] === col) {
                return true;
            }
        }
        return false;
    };
    function handleDragEvent(type, clientX, clientY) {
        var gameArea = document.getElementById("gameArea");
        var boardArea = document.getElementById("boardArea");
        var shapeArea = document.getElementById("shapeArea");
        var rotateArea = document.getElementById("rotateArea");
        if (gameLogic.endOfMatch(state.playerStatus)) {
            return;
        }
        if (!isYourTurn) {
            return;
        }
        //clearDrag("rotate");
        //clearDrag("shape");
        // compute horizontal and vertical offset relative to boardArea, shapeArea, and rotateArea
        // boardArea.offsetLeft = 0; boardArea.offsetTop = 0;
        var boardX = clientX - gameArea.offsetLeft - boardArea.offsetLeft;
        var shapeX = clientX - gameArea.offsetLeft - shapeArea.offsetLeft;
        var rotateX = clientX - gameArea.offsetLeft - rotateArea.offsetLeft;
        var boardY = clientY - gameArea.offsetTop - boardArea.offsetTop;
        var shapeY = clientY - gameArea.offsetTop - shapeArea.offsetTop;
        var rotateY = clientY - gameArea.offsetTop - rotateArea.offsetTop;
        var dragType = '';
        // initialize dragType
        var boardSize = getAreaSize('board');
        var shapeSize = getAreaSize('shape');
        var rotateSize = getAreaSize('rotate');
        var x, y;
        // ignore drag and drop if it's the computers turn
        if (boardX > 0 && boardX < boardSize.width && boardY > 0 && boardY < boardSize.height) {
            x = boardX;
            y = boardY;
            dragType = 'board';
        }
        else if (game.shape >= 0 && game.rotate === -1 && rotateX > 0 && rotateX < rotateSize.width && rotateY > 0 && rotateY < rotateSize.height) {
            x = rotateX;
            y = rotateY;
            dragType = 'rotate';
            clearDrag('board');
        }
        else if ((game.shape === -1 && game.rotate === -1 || game.shape >= 0 && game.rotate >= 0)
            && shapeX < shapeSize.width && shapeY > 0 && shapeY < shapeSize.height) {
            x = shapeX;
            y = shapeY;
            dragType = 'shape';
            clearDrag('rotate');
        }
        // ignore if none of the valid drag
        if (dragType === '') {
            clearDrag('board');
            clearDrag('shape');
            clearDrag('rotate');
            return;
        }
        // Inside gameArea. var's find the containing square's row and col
        var num = getRowColNum(dragType);
        var areaSize = getAreaSize(dragType);
        var col = Math.floor(num.colsNum * x / areaSize.width);
        var row = Math.floor(num.rowsNum * y / areaSize.height);
        if (dragType === 'board') {
            // ignore the drag if the player didn't choose a shape;
            if (game.shape === -1) {
                return;
            }
            if (game.rotate === -1) {
                return;
            }
            // Is the entire placement inside the board?
            var placement = gameLogic.getPlacement(row, col, game.shape, game.rotate); /*find a way to get placement*/
            if (!gameLogic.placementInBound(state.board, placement) || gameLogic.isOccupied(state.board, placement)) {
                clearDrag('board');
                return;
            }
            if (!angular.equals(preview, placement)) {
                clearDrag('board');
                setPlacementBackgroundColor(placement);
                preview = placement;
            }
        }
        // displaying the dragging lines
        var draggingLines = document.getElementById(dragType + "DraggingLines");
        var horizontalDraggingLine = document.getElementById(dragType + "HorizontalDraggingLine");
        var verticalDraggingLine = document.getElementById(dragType + "VerticalDraggingLine");
        draggingLines.style.display = "inline";
        var centerXY = getSquareCenterXY(row, col, dragType);
        verticalDraggingLine.setAttribute("x1", centerXY.x.toString());
        verticalDraggingLine.setAttribute("x2", centerXY.x.toString());
        horizontalDraggingLine.setAttribute("y1", centerXY.y.toString());
        horizontalDraggingLine.setAttribute("y2", centerXY.y.toString());
        //var topLeft = getSquareTopLeft(row, col, dragType);
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            dragDone(row, col, dragType);
            clearDrag(dragType);
        }
    }
    function getRowColNum(type) {
        if (type === 'board') {
            return { rowsNum: 20, colsNum: 20 };
        }
        if (type === 'shape') {
            return { rowsNum: 12, colsNum: 20 };
        }
        if (type === 'rotate') {
            return { rowsNum: 12, colsNum: 20 };
        }
    }
    function getSquareWidthHeight(type) {
        var size = getAreaSize(type);
        var num = getRowColNum(type);
        return {
            width: size.width / num.colsNum,
            height: size.height / num.rowsNum
        };
    }
    /*
    function getSquareTopLeft(row, col, type) {
        var size = getSquareWidthHeight(type);
        return {top: row * size.height, left: col * size.width}
    }
    */
    function getSquareCenterXY(row, col, type) {
        var size = getSquareWidthHeight(type);
        return {
            x: col * size.width + size.width / 2,
            y: row * size.height + size.height / 2
        };
    }
    //resizeGameAreaService.setWidthToHeight(0.6);
    function dragDone(row, col, dragType) {
        $rootScope.$apply(function () {
            if (dragType === 'board') {
                game.boardAreaCellClicked(row, col);
            }
            if (dragType === 'shape') {
                game.shapeAreaCellClicked(row, col);
            }
            if (dragType === 'rotate') {
                game.rotateAreaCellClicked(row, col);
            }
        });
    }
    //window.e2e_test_stateService = stateService; //to allow us to load any state in our e2e tests.
    // Before getting any updateUI, we initialize  variables (such as board)
    // and show an empty board to a viewer (so you can't perform moves).
    // updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2}); this is a fake call;
    /*gameService.setGame({
        minNumberOfPlayers: 2, // updated May 19
        maxNumberOfPlayers: 2, // updated May 19
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
  });*/
    function updateUI(params) {
        /*
            example of params = {stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2}
        */
        state = params.stateAfterMove;
        //state.board = params.stateAfterMove.board;
        //state.delta = params.stateAfterMove.delta;
        //state.freeShapes = params.stateAfterMove.freeShapes;
        //state.playerStatus = params.stateAfterMove.playerStatus;
        game.shape = -1; //initialize the shape being selected by current player
        game.rotate = -1; //initialize the rotate direction, DEV USE//03/31
        preview = []; // initialize the placement to be previewed on the board
        if (state.board === undefined) {
            state.board = gameLogic.getInitialBoard();
            state.freeShapes = gameLogic.getInitialFreeShapes();
            state.playerStatus = gameLogic.getInitialPlayerStatus();
        }
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        turnIndex = params.turnIndexAfterMove;
        internalTurnIndex = gameLogic.getInternalTurnIndex(); // initialize internal turn index
        // Is it the computer's turn?
        if (isYourTurn &&
            params.playersInfo[params.yourPlayerIndex].playerId === '') {
            isYourTurn = false; // to make sure the UI won't send another move.
            // Waiting 0.5 seconds to var the move animation finish; if we call aiService
            // then the animation is paused until the javascript finishes.
            $timeout(sendComputerMove, 500);
        }
        console.log("turnIndex: " + turnIndex);
        console.log("internalTurnIndex" + internalTurnIndex);
        console.log(state.playerStatus);
    }
    function sendComputerMove() {
        // just randomly send a possible move;
        var items = gameLogic.getPossibleMoves(state, internalTurnIndex); // changed turnIndex 05/19
        gameService.makeMove(items[Math.floor(Math.random() * items.length)]);
    }
    var getRotateAreaSquareColor = function (row, col) {
        if (game.getRotate(row, col) === -1) {
            return { background: '#F0F0F0' };
        }
        var color = getTurnColor();
        return {
            border: '1pt solid white',
            background: color };
    };
    /*updated on 04/01/2015*/
    /*return the rotation index for the selected shape*/
    game.getRotate = function (row, col) {
        var rotate = -1; // the square does not belong to any rotated shape
        if (game.shape === 0) {
            if (row === 1 && col === 1) {
                rotate = 0;
            }
        }
        if (game.shape === 1) {
            if (row === 0 && col === 1 || row === 1 && col === 1) {
                rotate = 0;
            }
            if (row === 1 && col === 5 || row === 1 && col === 6) {
                rotate = 1;
            }
        }
        if (game.shape === 2) {
            if (row >= 0 && row <= 2 && col === 1) {
                rotate = 0;
            }
            if (col >= 5 && col <= 7 && row === 1) {
                rotate = 1;
            }
        }
        if (game.shape === 3) {
            if (row >= 0 && row <= 3 && col === 1) {
                rotate = 0;
            }
            if (col >= 5 && col <= 8 && row === 2) {
                rotate = 1;
            }
        }
        if (game.shape === 4) {
            if (row >= 0 && row <= 4 && col === 1) {
                rotate = 0;
            }
            if (col >= 5 && col <= 9 && row === 2) {
                rotate = 1;
            }
        }
        if (game.shape === 5) {
            if (row === 1 && col === 1 || row === 2 && col === 1 || row === 2 && col === 2) {
                rotate = 0;
            }
            if (row === 1 && col === 6 || row === 1 && col === 7 || row === 2 && col === 6) {
                rotate = 1;
            }
            if (row === 1 && col === 11 || row === 1 && col === 12 || row === 2 && col === 12) {
                rotate = 2;
            }
            if (row === 2 && col === 17 || row === 2 && col === 18 || row === 1 && col === 18) {
                rotate = 3;
            }
        }
        if (game.shape === 6) {
            if (row >= 0 && row <= 2 && col === 1 || row === 2 && col === 2) {
                rotate = 0;
            }
            if (col >= 6 && col <= 8 && row === 1 || row === 2 && col === 6) {
                rotate = 1;
            }
            if (row >= 0 && row <= 2 && col === 12 || row === 0 && col === 11) {
                rotate = 2;
            }
            if (col >= 16 && col <= 18 && row === 2 || row === 1 && col === 18) {
                rotate = 3;
            }
            if (row >= 4 && row <= 6 && col === 2 || row === 6 && col === 1) {
                rotate = 4;
            }
            if (col >= 6 && col <= 8 && row === 6 || row === 5 && col === 6) {
                rotate = 5;
            }
            if (row >= 4 && row <= 6 && col === 11 || row === 4 && col === 12) {
                rotate = 6;
            }
            if (col >= 16 && col <= 18 && row === 5 || row === 6 && col === 18) {
                rotate = 7;
            }
        }
        if (game.shape === 7) {
            if (row === 1 && col === 2 || row === 1 && col === 3 || row === 2 && col === 1 || row === 2 && col === 2) {
                rotate = 0;
            }
            if (row === 0 && col === 6 || row === 1 && col === 6 || row === 1 && col === 7 || row === 2 && col === 7) {
                rotate = 1;
            }
            if (row === 1 && col === 11 || row === 1 && col === 12 || row === 2 && col === 12 || row === 2 && col === 13) {
                rotate = 4;
            }
            if (row === 1 && col === 17 || row === 2 && col === 17 || row === 0 && col === 18 || row === 1 && col === 18) {
                rotate = 5;
            }
        }
        if (game.shape === 8) {
            if (row === 0 && col === 1 || row === 0 && col === 2 || row === 1 && col === 1 || row === 1 && col === 2) {
                rotate = 0;
            }
        }
        if (game.shape === 9) {
            if (col >= 0 && col <= 3 && row === 3 || row === 2 && col === 0) {
                rotate = 0;
            }
            if (row >= 0 && row <= 3 && col === 6 || row === 0 && col === 7) {
                rotate = 1;
            }
            if (col >= 10 && col <= 13 && row === 2 || row === 3 && col === 13) {
                rotate = 2;
            }
            if (row >= 0 && row <= 3 && col === 17 || row === 3 && col === 16) {
                rotate = 3;
            }
            if (col >= 0 && col <= 3 && row === 8 || row === 7 && col === 3) {
                rotate = 4;
            }
            if (row >= 5 && row <= 8 && col === 6 || row === 8 && col === 7) {
                rotate = 5;
            }
            if (col >= 10 && col <= 13 && row === 7 || row === 8 && col === 10) {
                rotate = 6;
            }
            if (row >= 5 && row <= 8 && col === 17 || row === 5 && col === 16) {
                rotate = 7;
            }
        }
        if (game.shape === 10) {
            if (row === 2 && col === 1 || row === 2 && col === 2 || row === 2 && col === 3 || row === 0 && col === 2 || row === 1 && col === 2) {
                rotate = 0;
            }
            if (row === 0 && col === 6 || row === 1 && col === 6 || row === 2 && col === 6 || row === 1 && col === 7 || row === 1 && col === 8) {
                rotate = 1;
            }
            if (row === 0 && col === 11 || row === 0 && col === 12 || row === 0 && col === 13 || row === 1 && col === 12 || row === 2 && col === 12) {
                rotate = 2;
            }
            if (row === 1 && col === 16 || row === 1 && col === 17 || row === 1 && col === 18 || row === 0 && col === 18 || row === 2 && col === 18) {
                rotate = 3;
            }
        }
        if (game.shape === 11) {
            if (row === 0 && col === 1 || row === 1 && col === 1 || row === 2 && col === 1 || row === 2 && col === 2 || row === 2 && col === 3) {
                rotate = 0;
            }
            if (row === 0 && col === 6 || row === 0 && col === 7 || row === 0 && col === 8 || row === 1 && col === 6 || row === 2 && col === 6) {
                rotate = 1;
            }
            if (row === 0 && col === 11 || row === 0 && col === 12 || row === 0 && col === 13 || row === 1 && col === 13 || row === 2 && col === 13) {
                rotate = 2;
            }
            if (row === 2 && col === 16 || row === 2 && col === 17 || row === 2 && col === 18 || row === 0 && col === 18 || row === 1 && col === 18) {
                rotate = 3;
            }
        }
        if (game.shape === 12) {
            if (row === 2 && col >= 0 && col <= 1 || row === 1 && col >= 1 && col <= 3) {
                rotate = 0;
            }
            if (row >= 0 && row <= 1 && col === 6 || row >= 1 && row <= 3 && col === 7) {
                rotate = 1;
            }
            if (row === 2 && col >= 11 && col <= 13 || row === 1 && col >= 13 && col <= 14) {
                rotate = 2;
            }
            if (row >= 0 && row <= 2 && col === 17 || row >= 2 && row <= 3 && col === 18) {
                rotate = 3;
            }
            if (row === 6 && col >= 0 && col <= 2 || row === 7 && col >= 2 && col <= 3) {
                rotate = 4;
            }
            if (row >= 7 && row <= 8 && col === 6 || row >= 5 && row <= 7 && col === 7) {
                rotate = 5;
            }
            if (row === 6 && col >= 11 && col <= 12 || row === 7 && col >= 12 && col <= 14) {
                rotate = 6;
            }
            if (row >= 6 && row <= 8 && col === 17 || row >= 5 && row <= 6 && col === 18) {
                rotate = 7;
            }
        }
        if (game.shape === 13) {
            if (row === 1 && col >= 1 && col <= 3 || row === 0 && col === 3 || row === 2 && col === 1) {
                rotate = 0;
            }
            if (row >= 0 && row <= 2 && col === 7 || row === 0 && col === 6 || row === 2 && col === 8) {
                rotate = 1;
            }
            if (row === 1 && col >= 11 && col <= 13 || row === 0 && col === 11 || row === 2 && col === 13) {
                rotate = 4;
            }
            if (row >= 0 && row <= 2 && col === 17 || row === 2 && col === 16 || row === 0 && col === 18) {
                rotate = 5;
            }
        }
        if (game.shape === 14) {
            if (row === 1 && col >= 0 && col <= 2 || row === 0 && col === 1) {
                rotate = 0;
            }
            if (row >= 0 && row <= 2 && col === 6 || row === 1 && col === 7) {
                rotate = 1;
            }
            if (row === 0 && col >= 11 && col <= 13 || row === 1 && col === 12) {
                rotate = 2;
            }
            if (row >= 0 && row <= 2 && col === 18 || row === 1 && col === 17) {
                rotate = 3;
            }
        }
        if (game.shape === 15) {
            if (row >= 0 && row <= 1 && col >= 1 && col <= 2 || row === 2 && col === 1) {
                rotate = 0;
            }
            if (row >= 1 && row <= 2 && col >= 7 && col <= 8 || row === 1 && col === 6) {
                rotate = 1;
            }
            if (row >= 1 && row <= 2 && col >= 12 && col <= 13 || row === 0 && col === 13) {
                rotate = 2;
            }
            if (row >= 1 && row <= 2 && col >= 17 && col <= 18 || row === 2 && col === 19) {
                rotate = 3;
            }
            if (row >= 4 && row <= 5 && col >= 1 && col <= 2 || row === 6 && col === 2) {
                rotate = 4;
            }
            if (row >= 5 && row <= 6 && col >= 7 && col <= 8 || row === 6 && col === 6) {
                rotate = 5;
            }
            if (row >= 5 && row <= 6 && col >= 12 && col <= 13 || row === 4 && col === 12) {
                rotate = 6;
            }
            if (row >= 5 && row <= 6 && col >= 17 && col <= 18 || row === 5 && col === 19) {
                rotate = 7;
            }
        }
        if (game.shape === 16) {
            if (row === 0 && col === 2 || row === 0 && col === 3 || row === 1 && col === 1 || row === 1 && col === 2 || row === 2 && col === 1) {
                rotate = 0;
            }
            if (row === 0 && col === 6 || row === 0 && col === 7 || row === 1 && col === 7 || row === 1 && col === 8 || row === 2 && col === 8) {
                rotate = 1;
            }
            if (row === 2 && col === 12 || row === 2 && col === 13 || row === 1 && col === 13 || row === 1 && col === 14 || row === 0 && col === 14) {
                rotate = 2;
            }
            if (row === 0 && col == 17 || row === 1 && col === 17 || row === 1 && col == 18 || row === 2 && col === 18 || row === 2 && col === 19) {
                rotate = 3;
            }
        }
        if (game.shape === 17) {
            if (row >= 0 && row <= 2 && col === 1 || row === 0 && col === 2 || row === 2 && col === 2) {
                rotate = 0;
            }
            if (row === 1 && col >= 6 && col <= 8 || row === 2 && col === 6 || row === 2 && col === 8) {
                rotate = 1;
            }
            if (row >= 0 && row <= 2 && col === 13 || row === 0 && col === 12 || row === 2 && col === 12) {
                rotate = 2;
            }
            if (row === 2 && col >= 17 && col <= 19 || row === 1 && col === 17 || row === 1 && col === 19) {
                rotate = 3;
            }
        }
        if (game.shape === 18) {
            if (row >= 0 && row <= 2 && col === 2 || row === 1 && col === 1 || row === 0 && col === 3) {
                rotate = 0;
            }
            if (row === 1 && col >= 6 && col <= 8 || row === 0 && col === 7 || row === 2 && col === 8) {
                rotate = 1;
            }
            if (row >= 0 && row <= 2 && col === 13 || row === 2 && col === 12 || row === 1 && col === 14) {
                rotate = 2;
            }
            if (row === 1 && col >= 17 && col <= 19 || row === 0 && col === 17 || row === 2 && col === 18) {
                rotate = 3;
            }
            if (row >= 4 && row <= 6 && col === 2 || row === 4 && col === 1 || row === 5 && col === 3) {
                rotate = 4;
            }
            if (row === 5 && col >= 6 && col <= 8 || row === 6 && col === 7 || row === 4 && col === 8) {
                rotate = 5;
            }
            if (row >= 4 && row <= 6 && col === 13 || row === 5 && col === 12 || row === 6 && col === 14) {
                rotate = 6;
            }
            if (row === 5 && col >= 17 && col <= 19 || row === 6 && col == 17 || row === 4 && col === 18) {
                rotate = 7;
            }
        }
        if (game.shape === 19) {
            if (row === 0 && col === 2 || row === 1 && col === 2 || row === 2 && col === 2 || row === 1 && col === 1 || row === 1 && col === 3) {
                rotate = 0;
            }
        }
        if (game.shape === 20) {
            if (row === 2 && col >= 0 && col <= 3 || row === 1 && col === 1) {
                rotate = 0;
            }
            if (row >= 0 && row <= 3 && col === 6 || row === 1 && col === 7) {
                rotate = 1;
            }
            if (row === 1 && col >= 11 && col <= 14 || row === 2 && col === 13) {
                rotate = 2;
            }
            if (row >= 0 && row <= 3 && col === 18 || row === 2 && col === 17) {
                rotate = 3;
            }
            if (row === 7 && col >= 0 && col <= 3 || row === 6 && col === 2) {
                rotate = 4;
            }
            if (row >= 5 && row <= 8 && col === 6 || row === 7 && col === 7) {
                rotate = 5;
            }
            if (row === 6 && col >= 11 && col <= 14 || row === 7 && col === 12) {
                rotate = 6;
            }
            if (row >= 5 && row <= 8 && col === 18 || row === 6 && col === 17) {
                rotate = 7;
            }
        }
        return rotate;
    };
    game.rotateAreaCellClicked = function (row, col) {
        var rotate = game.getRotate(row, col);
        if (rotate >= 0) {
            rotate = rotate; // if the player clicks on a legal rotation, store the rotation in rotate
        }
    };
    game.boardAreaCellClicked = function (row, col) {
        console.log(["Clicked on cell:", row, col]);
        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }
        if (!isYourTurn) {
            return;
        }
        if (game.shape === -1) {
            return;
        }
        if (game.rotate === -1) {
            return;
        }
        try {
            var placement = gameLogic.getPlacement(row, col, game.shape, game.rotate);
            var move = gameLogic.createMove(state, placement, game.shape, internalTurnIndex); // changed turnIndex 05/19
            isYourTurn = false; // to prevent making another move
            gameService.makeMove(move);
            game.shape = -1; // to reset the shape being selected
            game.rotate = -1; // reset the rotate
        }
        catch (e) {
            console.log(["This is an illegal move:", row, col]);
            return;
        }
    };
    game.shapeAreaCellClicked = function (row, col) {
        // row = row - 1;
        var shapeNum = game.getShape(row, col);
        // ignore if the shape has been used
        if (!state.freeShapes[internalTurnIndex][shapeNum]) {
            return;
        }
        console.log(["Clicked on shape:", shapeNum]);
        game.shape = shapeNum;
        game.rotate = -1;
    };
    /*need to edit 03/26*/
    game.getShapeCellColorStyle = function (row, col) {
        var shapeNum = game.getShape(row, col);
        // changed turnIndex 05/19
        if (shapeNum >= 0 && state.freeShapes[internalTurnIndex] != undefined && state.freeShapes[internalTurnIndex][shapeNum]) {
            var color = getTurnColor();
            return {
                border: '1pt solid white',
                background: color };
        }
        else {
            return { background: '#F0F0F0' };
        }
    };
    /*updated on 04/01/2015*/
    game.getShape = function (row, col) {
        if (row === 0 && col === 4) {
            return 0;
        }
        if (col === 0 && (row === 3 || row === 4)) {
            return 1;
        }
        if (col === 2 && (row === 2 || row === 3 || row === 4)) {
            return 2;
        }
        if (col === 7 && (row === 1 || row === 2 || row === 3 || row === 4)) {
            return 3;
        }
        if (col === 9 && (row >= 0 && row <= 4)) {
            return 4;
        }
        if (row === 3 && col === 11 || row === 4 && col === 11 || row === 4 && col === 12) {
            return 5;
        }
        if (row === 0 && (col >= 0 && col <= 2) || row === 1 && col === 0) {
            return 6;
        }
        if ((row === 1 && (col === 11 || col === 12)) || row === 0 && (col === 12 || col === 13)) {
            return 7;
        }
        if ((row === 0 && (col === 15 || col === 16)) || (row === 1 && (col === 15 || col === 16))) {
            return 8;
        }
        if ((row === 0 && col === 18) || (col === 19 && row >= 0 && row <= 3)) {
            return 9;
        }
        if (row === 7 && (col === 0 || col === 1) || col === 2 && (row >= 6 && row <= 8)) {
            return 10;
        }
        if ((col === 0 && (row === 9 || row === 10 || row === 11)) || (row === 11 && (col === 1 || col === 2))) {
            return 11;
        }
        if ((row === 10 && (col === 16 || col === 17) || (row === 11 && (col === 17 || col === 18 || col === 19)))) {
            return 12;
        }
        if ((row === 9 && col === 12) || (row === 10 && (col === 10 || col === 11 || col === 12)) || (row === 11 && col === 10)) {
            return 13;
        }
        if ((row === 3 && col === 5) || (col === 4 && (row >= 2 && row <= 4))) {
            return 14;
        }
        if ((row === 7 && (col === 18 || col === 19)) || row === 6 && (col >= 17 && col <= 19)) {
            return 15;
        }
        if (row === 11 && (col === 4 || col === 5) || row === 10 && (col === 5 || col === 6) || row === 9 && col === 6) {
            return 16;
        }
        if (row === 3 && (col === 14 || col === 16) || row === 4 && col >= 14 && col <= 16) {
            return 17;
        }
        if (row === 6 && col === 9 || col === 10 && row >= 6 && row <= 8 || row === 7 && col === 11) {
            return 18;
        }
        if ((row === 6 && col === 14) || (row === 7 && (col === 13 || col === 14 || col === 15)) || (row === 8 && col === 14)) {
            return 19;
        }
        if (row === 7 && col === 5 || row === 6 && col >= 4 && col <= 7) {
            return 20;
        }
        return -1;
    };
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        "RULES_OF_BLOKUS": "Rules of Blokus",
        "RULES_SLIDE1": "Blokus is a 4-player game. Order of play is based on color, with blue going first, followed by yellow, red, and green. ",
        "RULES_SLIDE2": "The game is played on a square board divided into 20 rows and 20 columns, for a total of 400 squares. There are a total of 84 game tiles, organized into 21 shapes in each of four colors: blue, yellow, red, and green.",
        "RULES_SLIDE3": "The first piece played of each color is placed in one of the board's four corners. ",
        "RULES_SLIDE4": "Each new piece played must be placed so that it touches at least one piece of the same color, with only corner-to-corner contact allowed—edges cannot touch. However, edge-to-edge contact is allowed when two pieces of different color are involved.",
        "RULES_SLIDE5": "When a player cannot place a piece, he or she passes, and play continues as normal. The game ends when no one can place a piece.",
        "RULES_SLIDE6": "When a game ends, the score is based on the number of squares in each player's unplayed pieces",
        "CLOSE": "Close"
    });
    game.init();
});
/*
angular.module('myApp')
  .controller('Ctrl',
      ['', '$log', '$timeout',
        'gameLogic',
        function (, $log, $timeout,
        gameLogic) {

    'use strict';
}]);*/

/**
 * Created by zelengzhuang on 2/28/15.
 */

describe("In Blokus", function() {
    var _gameLogic;

    beforeEach(module("myApp"));

    beforeEach(inject(function(gameLogic) {
        _gameLogic = gameLogic;
    }));


    function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(true);
    }

    function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
        expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: stateBeforeMove,
            move: move})).toBe(false);
    }

/* BUG FOUND*/
/*  In the gameLogics.js, line 263 :
 if (j === 4 || j === 9 || j === 10 || j === 11 || j === 12
 || j === 13 || j === 15 || j === 16 || j === 16
 || j === 18 || j === 19 || j === 20) {
 score[i] += 5;
 }

 there are two j === 16
 replace j === 16 || j === 16 with j === 16 || j === 17


 P.S I don't understand in the author's test file, why freeShapes is 4 * 26. It should be 4 * 21.

 */

    it ("get score test", function() {
        var freeShapes = [[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
            [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
            [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
            [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]];
        expect(_gameLogic.getScore(freeShapes).toBe([1, 1, 1, 1]));
    });

/* BUG FOUND */
/*failed.
 * Find a bug.
 * When stateBeforeMove is {}, board, playerStatus, freeShapes are all undefined.
 * But in the code there is only checks of undefined for board.
 *
 * THERE SHOULD BE CHECKS OF UNDEFINED AND "GET INITIAL FUNCTIONS" FOR playStatus AND freeShapes TOO.
 */
    it("Test initial conditions", function () {
        expectMoveOk(0,
            {},
            [
                {setTurn: {turnIndex: 1}},
                {set: {key: "board", value: [['0','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','',''],
                                              ['','','','','','','','','','','','','','','','','','','','']]}},
                {set : {key : 'playerStatus', value : [true, true, true, true]}},
                {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                                                      [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                                                      [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                                                      [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
                {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}
            ]);
    });

//successful
    it("Ends the game test", function () {
        expectMoveOk(3,
            {
                board : [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','','1','1'],
                    ['0','','0','0','1','1','1','0','','1','0','0','0','0','','','3','','','1'],
                    ['1','','1','0','1','0','0','1','1','1','3','3','3','','2','3','3','3','1',''],
                    ['','1','1','1','0','0','0','1','0','0','3','2','3','2','2','2','3','1','1','1'],
                    ['1','','1','3','3','1','1','0','0','2','2','2','2','3','3','2','1','2','2','2'],
                    ['1','','3','3','1','1','2','2','2','0','0','0','0','0','3','3','1','1','3',''],
                    ['','2','','3','1','2','1','1','2','2','3','3','3','3','0','3','1','1','3',''],
                    ['0','2','1','1','3','2','1','3','3','3','2','2','2','3','0','1','3','3','1','1'],
                    ['0','2','1','3','3','2','1','3','2','2','0','0','2','0','0','1','1','3','','1'],
                    ['0','2','1','1','3','2','1','3','2','2','0','0','2','0','1','0','1','3','3','1'],
                    ['2','0','0','2','3','2','3','1','3','3','1','1','0','2','1','0','2','2','1','3'],
                    ['2','','0','2','2','3','3','1','3','3','1','1','0','2','1','0','0','2','1','3'],
                    ['2','2','0','0','2','3','0','1','1','1','0','0','0','2','1','0','2','2','1','3'],
                    ['','0','2','2','0','3','0','0','0','0','1','1','2','2','1','2','0','','1','3'],
                    ['','0','2','2','0','0','3','3','3','3','3','1','1','1','2','2','0','0','','2'],
                    ['0','0','0','2','1','0','0','1','1','1','1','3','3','2','2','0','0','2','','2'],
                    ['2','2','2','0','1','1','1','0','1','0','3','3','2','3','3','3','2','2','2',''],
                    ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','','2'],
                    ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
                    ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']],
                playerStatus : [false, false, false, true],
                freeShapes : [[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true]],
                delta : {shape : 0, placement : [[17, 19]]}},
            [{endMatch : {endMatchScore : [90, 90, 90, 90]}},
                {set : {key : 'board', value : [['0','0','','0','1','','','0','0','0','1','1','1','','3','3','','3','1','1'],
                    ['0','','0','0','1','1','1','0','','1','0','0','0','0','','','3','','','1'],
                    ['1','','1','0','1','0','0','1','1','1','3','3','3','','2','3','3','3','1',''],
                    ['','1','1','1','0','0','0','1','0','0','3','2','3','2','2','2','3','1','1','1'],
                    ['1','','1','3','3','1','1','0','0','2','2','2','2','3','3','2','1','2','2','2'],
                    ['1','','3','3','1','1','2','2','2','0','0','0','0','0','3','3','1','1','3',''],
                    ['','2','','3','1','2','1','1','2','2','3','3','3','3','0','3','1','1','3',''],
                    ['0','2','1','1','3','2','1','3','3','3','2','2','2','3','0','1','3','3','1','1'],
                    ['0','2','1','3','3','2','1','3','2','2','0','0','2','0','0','1','1','3','','1'],
                    ['0','2','1','1','3','2','1','3','2','2','0','0','2','0','1','0','1','3','3','1'],
                    ['2','0','0','2','3','2','3','1','3','3','1','1','0','2','1','0','2','2','1','3'],
                    ['2','','0','2','2','3','3','1','3','3','1','1','0','2','1','0','0','2','1','3'],
                    ['2','2','0','0','2','3','0','1','1','1','0','0','0','2','1','0','2','2','1','3'],
                    ['','0','2','2','0','3','0','0','0','0','1','1','2','2','1','2','0','','1','3'],
                    ['','0','2','2','0','0','3','3','3','3','3','1','1','1','2','2','0','0','','2'],
                    ['0','0','0','2','1','0','0','1','1','1','1','3','3','2','2','0','0','2','','2'],
                    ['2','2','2','0','1','1','1','0','1','0','3','3','2','3','3','3','2','2','2',''],
                    ['','2','0','0','0','1','','0','0','0','2','2','2','3','3','2','3','2','','2'],
                    ['2','','','0','','','3','3','3','3','2','','3','2','2','2','3','3','','3'],
                    ['2','2','0','','0','0','','2','2','2','3','3','3','','','2','3','','3','3']]}},
                {set : {key : 'playerStatus', value : [false, false, false, false]}},
                {set : {key : 'freeShapes', value : [[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
                    [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true]]}},
                {set : {key : 'delta', value : {shape : 0, placement : [[0,17]]}}}
            ]);
    });


    it("place a piece", function () {
        expectMoveOk(0,
            {
                board : [['0','','','','','','','','','','','','','','','','','','','1'],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['2','','','','','','','','','','','','','','','','','','','3']],
                playerStatus : [true, true, true, true],
                freeShapes : [[false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]],
                delta : {shape : 0, placement : [[19, 0]]}},
            [{setTurn: {turnIndex: 1}},
                {set : {key : 'board', value :
                    [['0','','','','','','','','','','','','','','','','','','','1'],
                        ['','0','','','','','','','','','','','','','','','','','',''],
                        ['','0','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['','','','','','','','','','','','','','','','','','','',''],
                        ['2','','','','','','','','','','','','','','','','','','','3']]}},
                {set : {key : 'playerStatus', value : [true, true, true, true]}},
                {set : {key : 'freeShapes', value : [[false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                    [false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]]}},
                {set : {key : 'delta', value : {shape : 1, placement : [[1,1], [2,1]]}}}
            ]);
    });

    it ("an example of a legal placement", function() {
        var board =  [['0','','1','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','','']];
        var placement = [[1,1]];
        var turnIndex = 1;
        expect(_gameLogic.legalPlacement(board, placement, turnIndex)).toBe(true);
    });



    it ("an example of an illegal placement", function() {
        var board =  [['0','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','','']];
        var placement = [[0,1]];
        var turnIndex = 0;
        expect(_gameLogic.legalPlacement(board, placement, turnIndex)).toBe(false);
    });
    it ("create a move when turnIndex is 1", function() {
        // example state = {board : [[...]...],
        // playerStatus : [true, true, true, true], freeShapes = [[true, true,
        // false...], [], [], []],
        // delta : {shape : 0, placement : [[2,2]]}
        var stateBeforeMove = {
            board : [['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','','']],
            playerStatus : [true, true, true, true],
            freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
            delta : {}};
        var placement = [[0,0]];
        var shape = 0;
        var turnIndex = 0;
        var expectedMove = [{setTurn : {turnIndex : 1}},
            {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','','']]}},
            {set : {key : 'playerStatus', value : [true, true, true, true]}},
            {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
            {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
        var generatedMove = _gameLogic.createMove(stateBeforeMove, placement, shape, turnIndex);
        expect(angular.equals(expectedMove, generatedMove)).toBe(true);
    });
    it ("example of isMove ok to be true", function(){
        var stateBeforeMove = {
            board : [['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','','']],
            playerStatus : [true, true, true, true],
            freeShapes : [[true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]],
            delta : {}};
        var move = [{setTurn : {turnIndex : 1}},
            {set : {key : 'board', value : [['0','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','','']]}},
            {set : {key : 'playerStatus', value : [true, true, true, true]}},
            {set : {key : 'freeShapes', value : [[false, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true],
                [true, true, true, true, true,true, true, true, true, true,true, true, true, true, true,true, true, true, true, true, true, true, true, true, true, true]]}},
            {set : {key : 'delta', value : {shape : 0, placement : [[0,0]]}}}];
        var turnIndexBeforeMove = 0;
        var params = {move : move ,stateBeforeMove : stateBeforeMove,turnIndexBeforeMove : turnIndexBeforeMove};
        expect(_gameLogic.isMoveOk(params)).toBe(true);
    });

} );
"use strict";

var duino = require('duino');

var arduinoStatus = 'unavailable',
    board = new duino.Board({debug: true});

board.on('error', function (error) {
    console.error(error);
    arduinoStatus = 'error';
    exports.arduinoStatus = arduinoStatus;
});

board.on('ready', function () {
    console.log('Arduino is ready');
    arduinoStatus = 'ready';
    exports.arduinoStatus = arduinoStatus;
});

board.on('connected', function () {
    console.log('Arduino is connected');
    arduinoStatus = 'connected';
    exports.arduinoStatus = arduinoStatus;
});

exports.board = board;
console.log("board is now available");
exports.arduinoStatus = arduinoStatus;
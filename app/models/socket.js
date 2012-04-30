"use strict";

var environment = require('../../config/environment');

var io = environment.io;

var arduino = require('../../arduino');

var board = arduino.board;
var arduinoStatus = arduino.arduinoStatus;

var config = require('../../config/settings');

//set Arduino metainfo channel
io.of('/meta/arduino').on('connection', function (socket) {
    socket.on('message', function (msg) {
        if (msg === 'blink led') {
            console.log('blink LED');
            console.log(board);
            board.digitalWrite(config.ledPin, board.HIGH);
            setTimeout(function () {
                board.digitalWrite(config.ledPin, board.LOW);
            }, 700);
            setTimeout(function () {
                board.digitalWrite(config.ledPin, board.HIGH);
            }, 1500);
        }
    });
});

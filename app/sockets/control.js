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
        var data = JSON.parse(msg);

        if (data.route === "/led/blink") {
            console.log('Blink LED');
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

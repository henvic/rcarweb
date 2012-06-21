"use strict";

var cache = require('memory-cache');

var environment = require('../../config/environment');

var io = environment.io;

var arduino = require('../../arduino');

var board = arduino.board;
var arduinoStatus = arduino.arduinoStatus;

var config = require('../../config/settings');

var morse = require('../../public/javascripts/morse');

function ledUpDown(interval) {
    board.digitalWrite(config.ledPin, board.HIGH);
    setTimeout(function () {
        board.digitalWrite(config.ledPin, board.LOW);
    }, interval);
}

function delayedLedUpDown(interval, wait) {
    board.digitalWrite(config.ledPin, board.LOW);
    setTimeout(function () {
        ledUpDown(interval);
    }, wait);
}

function writeMorseMessage(message, socket) {
    var morseMessage = morse.encode(message);

    var wait = 0;
    for (var i = 0; i < morseMessage.length; i++) {
        var charDelay = 0;
        var getChar = morseMessage.charAt(i);

        if (getChar === '.') {
            charDelay = 100;
        } else if (getChar === '-') {
            charDelay = 300;
        }

        if (charDelay > 0) {
            delayedLedUpDown(charDelay, wait);

            wait = wait + charDelay;
        }

        if (getChar === ' ') {
            wait = wait + 700;
        } else {
            wait = wait + 300;
        }
    }

    console.log('Message: ' + message + ' and morse code: ' + morseMessage);
}

//set Arduino metainfo channel
io.of('/meta/arduino').on('connection', function (socket) {
    socket.on('/led/blink', function (msg) {
        writeMorseMessage('sos', socket);
    });
    socket.on('/led/morse', function (msg) {
        writeMorseMessage(String(msg.message), socket);
    });
});

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
    /** begin of speed control **/
    var speedControlClosure = (function () {
        if (cache.get('speed') === null) {
            cache.put('speed', 0);
            board.analogWrite(config.motorPin, cache.get('speed'));
            console.log('setting speed to ' + cache.get('speed'));
        }
        socket.emit('/speed-control', cache.get('speed'));
        socket.on('/speed-control', function (unfilteredSpeed) {
            var speed = parseInt (unfilteredSpeed, 10);
            var minSpeed = 0;
            var maxSpeed = 255;

            if (speed >= minSpeed && speed <= maxSpeed) {
                socket.broadcast.emit('/speed-control', speed);
                cache.put('speed', speed);
                board.analogWrite(config.motorPin, speed);
            } else {
                console.log('Not broadcasting speed in unallowed range (min: ' +
                    minSpeed + ', max: ' + maxSpeed +'): ' + speed);
                socket.emit('/speed-control', cache.get('speed'));
            }
        });
    } ());
    /** end of speed control **/

    /** begin of rgb led **/
    var rgbLedClosure = (function () {
        if (cache.get('rgb-led') === null) {
            cache.put('rgb-led', {red: 0, green: 0, blue: 0});
            board.analogWrite(config.redPin, 0);
            board.analogWrite(config.greenPin, 0);
            board.analogWrite(config.bluePin, 0);
            console.log('setting RGB LED output to zero');
        }
        socket.emit('/rgb-led', cache.get('rgb-led'));
        socket.on('/rgb-led', function (rgb) {
            var min = 0;
            var max = 255;
            var red = parseInt (rgb.red, 10);
            var green = parseInt (rgb.green, 10);
            var blue = parseInt (rgb.blue, 10);
            var color = {
                red: red,
                green: green,
                blue: blue
            };
            console.log(color);
            if (red >= min && red <= max &&
                green >= min && green <= max &&
                blue >= min && blue <= max
                ) {
                socket.broadcast.emit('/rgb-led', color);
                cache.put('rgb-led', color);
                board.analogWrite(config.redPin, red);
                board.analogWrite(config.greenPin, green);
                board.analogWrite(config.bluePin, blue);
            } else {
                console.log('Not broadcasting color in unallowed range (min: ' +
                    min + ', max: ' + max +'): ');
                socket.emit('/rgb-led', cache.get('rgb-led'));
            }
        });
    } ());
    /** end of rgb led **/
    socket.on('/led/blink', function (msg) {
        writeMorseMessage('sos', socket);
    });
    socket.on('/led/morse', function (msg) {
        writeMorseMessage(String(msg.message), socket);
    });
});

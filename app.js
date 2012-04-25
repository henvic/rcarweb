"use strict";
/*jslint node: true */

/**
 * Module dependencies.
 */
var sio = require('socket.io'),
    express = require('express'),
    routes = require('./routes'),
    util = require('util'),
    connect = require('express/node_modules/connect'),
    arduino = require('duino'),
    config = require('./config');


/**
 * create app
 */
var app = express.createServer(),
    io = sio.listen(app),
    parseCookie = connect.utils.parseCookie,
    MemoryStore = connect.middleware.session.MemoryStore,
    store;

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
    app.use(express.cookieParser());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.session({
        secret: 'secret',
        key: 'express.sid',
        store: store = new MemoryStore()
    }));
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

io.configure('development', function () {
    io.set('log level', 3);
});

app.get('/', routes.index);

io.set('authorization', function (data, accept) {
    if (!data.headers.cookie) {
        return accept('No cookie transmitted.', false);
    }

    data.cookie = parseCookie(data.headers.cookie);
    data.sessionID = data.cookie['express.sid'];

    store.load(data.sessionID, function (err, session) {
        if (err || !session) {
            return accept('Error', false);
        }

        data.session = session;
        return accept(null, true);
    });
}).sockets.on('connection', function (socket) {
    var sess = socket.handshake.session;
    socket.log.info(
        'a socket with sessionID',
        socket.handshake.sessionID,
        'connected'
    );
    socket.on('set value', function (val) {
        sess.reload(function () {
            sess.value = val;
            sess.touch().save();
        });
    });
});

var metaArduino = io
    .of('/meta/arduino')
    .on('message', function (msg) {
        console.log(msg);
    });

var arduinoStatus = 'unavailable',
    board = new arduino.Board({debug: true});

exports.board = board;
exports.arduinoStatus = arduinoStatus;

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

//set Arduino metainfo channel
io.of('/meta/arduino').on('connection', function (socket) {
    socket.on('message', function (msg) {
        if (msg === 'blink led') {
            console.log('blink LED');
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

app.listen(config.port);

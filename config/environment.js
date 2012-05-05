"use strict";

/*global app */

/**
 * Module dependencies.
 */
var sio = require('socket.io'),
    express = require('express'),
    connect = require('express/node_modules/connect');

/**
 * create app
 */
var io = sio.listen(app),
    parseCookie = connect.utils.parseCookie,
    MemoryStore = connect.middleware.session.MemoryStore,
    store;

exports.io = io;

app.configure(function () {
    var cwd = process.cwd();
    app.set('views', cwd + '/app/views');
    app.set('view engine', 'ejs');
    app.set('view options', {complexNames: true});
    app.use(express.cookieParser());
    app.use(require('less-middleware')({ src: cwd + '/public' }));
    app.use(express.static(cwd + '/public', {maxAge: 300}));
    app.use(express.session({
        secret: 'secret',
        key: 'express.sid',
        store: store = new MemoryStore()
    }));
    app.use(app.router);
});

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

    console.log("Requiring the socket model");
    //var socketModel = require('../app/models/socket');
});


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


app.listen(config.port);

"use strict";

/*global app */

var environment = require('../environment'),
    io = environment.io;

app.configure('development', function () {
    app.disable('view cache');
    app.disable('model cache');
    app.disable('eval cache');
    app.enable('log actions');
    app.enable('env info');
    app.use(require('express').errorHandler({ dumpExceptions: true, showStack: true }));
    io.set('log level', 3);
});


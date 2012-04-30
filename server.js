#!/usr/bin/env node

"use strict";
/*jslint node: true */

/**
 * Module dependencies.
 */
var config = require('./config/settings'),
    arduino = require('./arduino');

/**
 * create app
 */
var app = module.exports = require('railway').createServer();

if (!module.parent) {
	//@todo see why code is not entering here when caled with railway!!!
    var port = process.env.PORT || config.port;
    app.listen(port);
    console.log("Railway server listening on port %d within %s environment", port, app.settings.env);
}

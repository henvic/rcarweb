"use strict";
/*global load, action, render */

load('application');

var arduino = require('../../arduino');
var config = require('../../config/settings');

action('index', function () {
    render({
        arduinoStatus: arduino.arduinoStatus,
        config: config,
        title: "rcarweb"
    });
});
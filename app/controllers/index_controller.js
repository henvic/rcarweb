"use strict";
/*global load, action, render */

load('application');

var arduino = require('../../arduino');

action('index', function () {
    render({
        arduinoStatus: arduino.arduinoStatus,
        title: "rcarweb"
    });
});
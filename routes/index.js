
/*
 * GET home page.
 */

var app = require('../app');

exports.index = function (req, res) {
    res.render('index', { title: 'rcarweb', arduinoStatus: app.arduinoStatus });
};
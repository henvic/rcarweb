"use strict";

exports.morse = function (test) {
    test.expect(4);

    var morse = require('../../../public/javascripts/morse');

    test.strictEqual(morse.encode("sos"), ". . .   - - -   . . .", "sos message");
    test.strictEqual(morse.encode("sos", true), ".&nbsp;.&nbsp;.&nbsp;&nbsp;&nbsp;-&nbsp;-&nbsp;-&nbsp;&nbsp;&nbsp;.&nbsp;.&nbsp;.", "sos message escaped to HTML");
    test.strictEqual(morse.encode("test"), "-   .   . . .   -", "test message");
    test.strictEqual(morse.encode("Give me"), "- - .   . .   . . . -   .       - -   .", "Give me message");

    test.done();
};

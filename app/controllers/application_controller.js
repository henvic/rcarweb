"use strict";

/*global before, protectFromForgery */
before('protect from forgery', function () {
    protectFromForgery('282f1b0328e4a947e4bc57bc46f7bd8296d8759b');
});

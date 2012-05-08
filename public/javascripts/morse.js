"use strict";

var morse = {
    encode: function (message, html) {
        var t = {
            "a": ". -",
            "b": "- . . .",
            "c": "- . - .",
            "d": "- . .",
            "e": ".",
            "é": ". . - . .",
            "f": ". . - .",
            "g": "- - .",
            "h": ". . . .",
            "i": ". .",
            "j": ". - - -",
            "k": "- . -",
            "l": ". - . .",
            "m": "- -",
            "n": "- .",
            "o": "- - -",
            "p": ". - - .",
            "q": "- - . -",
            "r": ". - .",
            "s": ". . .",
            "t": "-",
            "u": ". . -",
            "v": ". . . -",
            "w": ". - -",
            "x": "- . . -",
            "y": "- . - -",
            "z": "- - . .",
            "1": ". - - - -",
            "2": ". . - - -",
            "3": ". . . - -",
            "4": ". . . . -",
            "5": ". . . . .",
            "6": "- . . . .",
            "7": "- - . . .",
            "8": "- - - . .",
            "9": "- - - - .",
            "0": "- - - - -",
            ".": ". - . - . -",
            ",": "- - . . - -",
            ":": "- - - . . .",
            "?": ". . - - . .",
            "’": ". - - - - .",
            "–": "- . . . . -",
            "/": "- . . - .",
            "(": "- . - - .",
            ")": "- . - - . -",
            "“": ". - . . - .",
            "”": ". - . . - .",
            "=": "- . . . -",
            "+": ". - . - .",
            "×": "- . . -",
            "@": ". - - . - ."
        };
        
        var code = '';
        var chars = message.toLowerCase().split("");

        var length = chars.length;

        for (var x = 0; x < length; x++) {
            if (chars[x] === " ") {
                code += "       ";
            } else {
                if (t[chars[x]]) {
                    if (html) {
                        code += t[chars[x]].replace(/ /gi, "&nbsp;");

                        if (x < length - 1 && chars[x + 1] !== " ") {
                            code += "&nbsp;&nbsp;&nbsp;";
                        }
                    } else {
                        code += t[chars[x]];

                        if (x < length - 1 && chars[x + 1] !== " ") {
                            code += "   ";
                        }
                    }
                }
            }
        }
        
        return code;
    }
};

if (typeof exports === 'object' && exports) {
    module.exports = morse;
}

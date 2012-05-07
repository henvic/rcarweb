"use strict";
(function ($) {
    $(function () {
        /*global io, jQuery, window */
        var socket = io.connect(''),
            metaArduino = io.connect('/meta/arduino');

        $("a[href*=#]").click(function (e) {
            var href = $(this).attr('href');
            var timeout = 400;

            e.preventDefault();
            $('html,body').animate({scrollTop:$(this.hash).offset().top}, timeout);
            setTimeout(function () {
                window.location.hash = href;
            }, timeout);
        });

        function morse(message, html) {
            var table = [];
            table["a"]=". _";
            table["b"]="_ . . .";
            table["c"]="_ . _ .";
            table["d"]="_ . .";
            table["e"]=".";
            table["é"]=". . _ . .";
            table["f"]=". . _ .";
            table["g"]="_ _ .";
            table["h"]=". . . .";
            table["i"]=". .";
            table["j"]=". _ _ _";
            table["k"]="_ . _";
            table["l"]=". _ . .";
            table["m"]="_ _";
            table["n"]="_ .";
            table["o"]="_ _ _";
            table["p"]=". _ _ .";
            table["q"]="_ _ . _";
            table["r"]=". _ .";
            table["s"]=". . .";
            table["t"]="_";
            table["u"]=". . _";
            table["v"]=". . . _";
            table["w"]=". _ _";
            table["x"]="_ . . _";
            table["y"]="_ . _ _";
            table["z"]="_ _ . .";
            table["1"]=". _ _ _ _";
            table["2"]=". . _ _ _";
            table["3"]=". . . _ _";
            table["4"]=". . . . _";
            table["5"]=". . . . .";
            table["6"]="_ . . . .";
            table["7"]="_ _ . . .";
            table["8"]="_ _ _ . .";
            table["9"]="_ _ _ _ .";
            table["0"]="_ _ _ _ _";
            table["."]=". − . − . −";
            table[","]="− − . . − −";
            table[":"]="− − − . . .";
            table["?"]=". . − − . .";
            table["’"]=". − − − − .";
            table["–"]="− . . . . −";
            table["/"]="− . . − .";
            table["("]="− . − − .";
            table["("]="− . − − .";
            table["“"]=". - . . - .";
            table["”"]=". - . . - .";
            table["="]="- . . . -";
            table["+"]=". - . - .";
            table["×"]="- . . -";
            table["@"]=". - - . - .";
            var code = '';
            var chars = message.toLowerCase().split("");

            for (var x = 0; x < chars.length; x++) {
                if (chars[x] === " ") {
                    code += "       ";
                } else {
                    if (table[chars[x]]) {
                        if (html) {
                            code += table[chars[x]].replace(/ /gi, "&nbsp;") + "&nbsp;&nbsp;&nbsp;";
                        } else {
                            code += table[chars[x]] + "   ";
                        }
                    }
                }
            }
            
            return code;
        }

        $('#morse-submit').click(function (e) {
            var morseTextarea = $('#morse-textarea');
            var morseReturn = $('#morse-return');
            var message = morseTextarea.val();

            e.preventDefault();

            morseReturn.html('<i class="icon-arrow-right"></i> ' + morse(message, true));
        });

        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this).scrollspy('refresh');
        });

        $("#rc-btn-cam").toggle(
            function () {
                var btn = $(this);
                btn.html("<i class=\"icon-facetime-video icon-white\"></i> turn off the cam");
                btn.removeClass("btn-default").addClass("btn-inverse");
            },
            function () {
                var btn = $(this);
                btn.html("<i class=\"icon-facetime-video\"></i> turn on the cam");
                btn.removeClass("btn-inverse").addClass("btn-default");
            }
        );


        $('#pin13-debug-btn').popover();

        $('#pin13-debug-btn').click(function () {
            metaArduino.send('blink led');
            console.log('debug button clicked');
        });

        $("#rc-btn-park").click(function () {
            var progress = $('#progress');
            progress.addClass('active');
            setTimeout(function () {
                progress.removeClass('active');
            }, 4000);
        });

        socket.on('connect', function () {
            console.log('Socket.IO: connected');
            var status = $('#websocket-connection-status'),
                socketType = $('#socket-type'),
                mainAlertZone = $('#main-alert-zone'),
                transport = socket.socket.transport.name;
            status.removeClass('icon-remove-sign').addClass('icon-ok-sign');

            if (transport !== 'websocket') {
                socketType.text(transport);
                mainAlertZone.append('<div class="alert"><a class="close" data-dismiss="alert">×</a>' +
                    '<strong>Warning!</strong> You\'re not using WebSockets.' +
                    ' If it\'s your lucky day you might be able to ride the car thanks to backwards compatibility.</div>'
                    );
            }
        });
        socket.on('disconnect', function () {
            console.log('Socket.IO: disconnected');
            var status = $('#websocket-connection-status');
            status.removeClass('icon-ok-sign').addClass('icon-remove-sign');
        });
    });
}(window.jQuery));

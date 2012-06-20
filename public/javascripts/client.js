"use strict";
(function ($) {
    $(function () {
        /*global io, jQuery, window, morse */
        var socket = io.connect(''),
            metaArduino = io.connect('/meta/arduino');

        $('a[href*=#]').click(function (e) {
            var href = $(this).attr('href');
            var timeout = 400;

            e.preventDefault();
            $('html,body').animate({scrollTop:$(this.hash).offset().top}, timeout);
            setTimeout(function () {
                window.location.hash = href;
            }, timeout);
        });

        $('#morse-submit').click(function (e) {
            var morseTextarea = $('#morse-textarea');
            var morseReturn = $('#morse-return');
            var message = morseTextarea.val();

            e.preventDefault();

            morseReturn.html('<i class="icon-arrow-right"></i> ' + morse.encode(message, true));
            metaArduino.emit("/led/morse", {"message":[message]});
        });

        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this).scrollspy('refresh');
        });

        $('#rc-btn-cam').toggle(
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
            metaArduino.emit("/led/blink", {});
            console.log('debug button clicked');
        });

        $('#rc-btn-park').click(function () {
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

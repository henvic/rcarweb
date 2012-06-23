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

        var arduinoNotFoundModal = $('#arduinoNotFoundModal');
        if (arduinoNotFoundModal.length > 0) {
            arduinoNotFoundModal.modal();
        }

        /** begin of RGB LED */
        var rgbLedClosure = (function () {
            var rgb2hex = function(red, green, blue) {
                var hex = [
                    parseInt(red, 10).toString(16).toUpperCase(),
                    parseInt(green, 10).toString(16).toUpperCase(),
                    parseInt(blue, 10).toString(16).toUpperCase()
                ];

                $.each(hex, function(nr, val) {
                    if (val.length === 1) {
                        hex[nr] = '0' + val;
                    }
                });
                return '#' + hex.join('');
            };

            var redLed = $('#rgb-led-r');
            var greenLed = $('#rgb-led-g');
            var blueLed = $('#rgb-led-b');
            var rgbLed = $('#rgb-led');
            var avoidEmit = false;

            rgbLed.miniColors({
                letterCase: 'uppercase',
                change: function(hex, rgb) {
                    redLed.val(rgb.r);
                    greenLed.val(rgb.g);
                    blueLed.val(rgb.b);
                    if (avoidEmit) {
                        avoidEmit = false;
                        console.log('emit avoided');
                        return false;
                    }
                    metaArduino.emit('/rgb-led', {
                        red: rgb.r,
                        green: rgb.g,
                        blue: rgb.b
                    });
                }
            });

            $('#rgb-led-r,#rgb-led-g,#rgb-led-b').bind('change keyup mouseup', function (e) {
                var red = redLed.val();
                var green = greenLed.val();
                var blue = blueLed.val();
                rgbLed.miniColors('value', '#' + rgb2hex(red, green, blue));
            });

            metaArduino.on('/rgb-led', function (rgb) {
                console.log('new colors: red=' + rgb.red + ', blue=' + rgb.blue + ', green=' + rgb.green);
                avoidEmit = true;
                rgbLed.miniColors('value', '#' + rgb2hex(rgb.red, rgb.green, rgb.blue));
            });
        } ());
        /** end of RGB LED */

        /** begin of speed control **/
        var speedControlClosure = (function () {
            var speedControl = $('#speed-control');
            var speedControlGauge = $('#speed-control-gauge');
            var avoidEmit = false;

            speedControl.bind('change keyup mouseup', function (e) {
                if (avoidEmit) {
                    avoidEmit = false;
                    console.log('emit avoided');
                   return false;
                }
                speedControlGauge.text(this.value);
                metaArduino.emit('/speed-control', this.value);
            });

            metaArduino.on('/speed-control', function (speed) {
                console.log('new cruise speed: ' + speed);
                avoidEmit = true;
                speedControl.val(speed);
                speedControlGauge.text(speed);
            });
        } ());
        /** end of speed control **/

        /** begin of morse **/
        var morseClosure = (function () {
            var morseSubmit = $('#morse-submit');
            var morseReturn = $('#morse-return');

            metaArduino.on('/led/morse/status', function (status) {
                if (status.error) {
                    morseReturn.html('<i class="icon-info-sign"></i> <em>error:</em> message to long');
                }
                morseSubmit.attr('disabled', 'disabled');
                if (! status.self) {
                    morseReturn.text(status.echo).prepend('<i class="icon-exclamation-sign"></i> <em>wait, message is underway:</em> ');
                    console.log(status.echo);
                }
                setTimeout(function () {
                    morseSubmit.removeAttr('disabled');
                    morseReturn.text('');
                }, parseInt(status.wait, 10));
            });

            morseSubmit.click(function (e) {
                var morseTextarea = $('#morse-textarea');
                var morseReturn = $('#morse-return');
                var message = morseTextarea.val();

                e.preventDefault();

                morseReturn.html('<i class="icon-arrow-right"></i> ' + morse.encode(message, true));
                metaArduino.emit('/led/morse', {'message':[message]});
            });
        } ());
        /** end of morse **/

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

        var rxIndicator = $('#rx-indicator');
        var txIndicator = $('#tx-indicator');
        metaArduino.on('transmission', function (msg) {
            if (msg === 'rx') {
                rxIndicator.css('opacity', 1).fadeTo('fast', 0.5);
            } else if (msg === 'tx') {
                txIndicator.css('opacity', 1).fadeTo('fast', 0.5);
            } else {
                console.log('Can\'t notify.');
            }
            console.log(msg);
        });

        socket.on('disconnect', function () {
            console.log('Socket.IO: disconnected');
            var status = $('#websocket-connection-status');
            var socketNotFoundModal = $('#socketNotFoundModal');
            if (socketNotFoundModal.length > 0) {
                socketNotFoundModal.modal({keyboard: false});
            }

            status.removeClass('icon-ok-sign').addClass('icon-remove-sign');
        });

        socket.on('connect_failed', function () {
            var socketNotFoundModal = $('#socketNotFoundModal');
            if (socketNotFoundModal.length > 0) {
                socketNotFoundModal.modal({keyboard: false});
            }
        });

        socket.on('reconnect', function () {
            var socketNotFoundModal = $('#socketNotFoundModal');
            if (socketNotFoundModal.length > 0) {
                socketNotFoundModal.modal('hide');
            }
        });
    });
}(window.jQuery));

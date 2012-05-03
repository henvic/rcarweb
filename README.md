#rcarweb
[![Build Status](https://secure.travis-ci.org/henvic/rcarweb.png?branch=master)](http://travis-ci.org/henvic/rcarweb)

## Presentation
Take a ride in a RC car with Arduino, WebSockets and node.js.

This is a hobby project yet in its first steps. It is not functional yet.

A simple RC car which its remote control connected to a Arduino which will send instructions received from a web browser.

## Install
[node.js](http://nodejs.org/) is the platform. If you don't have, install it first.

After, on your CLI (command-line interface) clone the project:

```
git clone git://github.com/henvic/rcarweb.git
```


And then:

```
cd rcarweb
./bin/install
```

### This should install at least the following

#### npm packages
* [duino](https://github.com/ecto/duino)
* [RailwayJS](http://railwayjs.com/)
* [express](http://expressjs.com/)
* [jade](http://jade-lang.com/)
* [socket.io](http://socket.io/)
* [less-middleware](https://github.com/emberfeather/less.js-middleware)

#### client-side libraries
* [jQuery](http://jquery.com/)
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/)


## Run
With the Arduino connected to your computer run:

```
node server
```

## Contributing (push, open bugs, etc)
Feel free to push code to this repository. Anything you want, go to the [issue tracker](https://github.com/henvic/rcarweb/issues/).

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
This software is provided "as is", without warranty.
The [New BSD License](http://en.wikipedia.org/wiki/New_BSD_license) and the [MIT License](http://en.wikipedia.org/wiki/MIT_License) are the licenses (case you need something legal).

## Author
Henrique Vicente de Oliveira Pinto ([email](mailto:henriquevicente@gmail.com), [Twitter](https://twitter.com/henriquev), [Flickr](http://www.flickr.com/photos/henriquev), [Linkedin](http://linkedin.com/in/henvic)).
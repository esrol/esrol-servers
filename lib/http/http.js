'use strict';
let Errors = require('esrol-errors');
let http = require('http');
let cluster = require('cluster');
let server = new WeakMap();
let errors = new Errors();

class HTTPServer {

  static createServer(settings) {
    if (!settings) {
      errors.error(`${typeof settings}`, 1);
    }
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port}`, 1);
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router}`, 1);
    }
    return HTTPServer._createServer(settings);
  }

  static getServerInstance() {
    return server.http;
  }

  static getServerPort() {
    return server.port;
  }

  static _createServer(settings) {
    server.cluster = settings.cluster;
    server.port = settings.port;
    server.http = http.createServer(settings.router);
    HTTPServer._onServerCreated(settings);
    return server.http;
  }

  static _onServerCreated(settings) {
    server.http.on('listening', () => {
      HTTPServer._onListening(settings.onListening);
    });
    HTTPServer._listen(settings);
  }

  static _onListening(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }

  static _listen(settings) {
    if (HTTPServer._shouldListen(settings)) {
      server.http.listen(settings.port);
    }
  }

  static _shouldListen(settings) {
    if (!settings.cluster || (!settings.webSocket && !cluster.isMaster)) {
      return true;
    }
    return false;
  }

  static _registerErrors() {
    errors.registerErrorWithNumber(
      'createServer expects object as argument, holding port and router as'
      + ' keys. Eg: {port:3333, router: routerFunction} Caused in esrol-servers'
      + ' module, Class HTTPServer',
      1
    );
    errors.registerErrorWithNumber(
      'HTTPServer is a static class and should be accessed statically through'
      + ' createServer method. Caused in esrol-servers'
      + ' module, Class HTTPServer',
      2
    );
  }

}

HTTPServer._registerErrors();

module.exports = HTTPServer;

/**
 * @author Ivaylo Ivanov
 * @private
 * @class HTTPServer
 * @description Creates http server
 * @requires cluster
 * @requires esrol-errors
 * @requires http
 * @requires debug
 */
'use strict';
let Errors = require('esrol-errors');
let http = require('http');
let cluster = require('cluster');
let debug = require('debug')('esrol-servers:http');
let server = new WeakMap();
let errors = new Errors();

class HTTPServer {

  /**
  * @private
  * @method createServer
  * @description Wrapper for creating http server
  * @param {object} settings - see example
  * @throws {error} error - if no settings are passed
  * @throws {error} error - if no settings.port is passed
  * @throws {error} error - if no settings.router is passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createServer(settings) {
    if (!settings) {
      errors.error(`${typeof settings} for settings is passed`, 1);
    }
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port} for port is passed`, 1);
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router} for router is passed`, 1);
    }
    return HTTPServer._createServer(settings);
  }

  /**
  * @private
  * @method getServerInstance
  * @description Get http server instace
  * @returns {object} server - server instance
  */
  static getServerInstance() {
    return server.http;
  }

  /**
  * @private
  * @method getServerPort
  * @description Retrieve the port the http server is currently listening on
  * @returns {int} port
  */
  static getServerPort() {
    return server.port;
  }

  /**
  * @private
  * @method _createServer
  * @description Create http server
  * @param {object} settings - see example
  * @returns {object} server - server instance
  * @see examples
  */
  static _createServer(settings) {
    debug('create http server on port %s', settings.port);
    server.cluster = settings.cluster;
    server.port = settings.port;
    server.http = http.createServer(settings.router);
    HTTPServer._onServerCreated(settings);
    return server.http;
  }

  /**
  * @private
  * @method _onServerCreated
  * @description Bind on "listening" event to http server and call _listen
  * after that
  * @param {object} settings - see example
  */
  static _onServerCreated(settings) {
    debug('binding http server "listening" event');
    server.http.on('listening', () => {
      HTTPServer._onListening(settings.onListening);
    });
    HTTPServer._listen(settings);
  }

  /**
  * @private
  * @method _onListening
  * @description If "onListening" function is passed with settings in
  * createServer, call it
  * @param {function} fn - the "onListening" function, passet to
  * createServer in settings object
  */
  static _onListening(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }

  /**
  * @private
  * @method _listen
  * @description If _shouldListen return true, call server.listen(port)
  * @param {object} settings - see example
  */
  static _listen(settings) {
    if (HTTPServer._shouldListen(settings)) {
      server.http.listen(settings.port);
    }
  }

  /**
  * @private
  * @method _shouldListen
  * @description Determine if the server should listen when it's created.
  * The server should listen only if the cluster is not enabled or
  * http websocket is not enabled and this is not the master process
  * @param {object} settings - see example
  */
  static _shouldListen(settings) {
    if (!settings.cluster || (!settings.webSocket && !cluster.isMaster)) {
      return true;
    }
    return false;
  }

  /**
  * @private
  * @method _registerErrors
  * @description A method for registering errors thrown by this class
  */
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

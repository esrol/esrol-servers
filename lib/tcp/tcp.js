/**
 * @author Ivaylo Ivanov
 * @private
 * @class TCPServer
 * @description Creates tcp server
 * @requires cluster
 * @requires esrol-errors
 * @requires net
 * @requires debug
 */
'use strict';
let net = require('net');
let cluster = require('cluster');
let Errors = require('esrol-errors');
let debug = require('debug')('esrol-servers:tcp');
let server = new WeakMap();
let errors = new Errors();

class TCPServer {

  /**
  * @private
  * @method createServer
  * @description Wrapper for creating tcp server
  * @param {object} settings - see example
  * @param {object} options (optional) - see example
  * @throws {error} error - if no settings are passed
  * @throws {error} error - if no settings.port is passed
  * @throws {error} error - if no settings.router is passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createServer(settings, options) {
    if (!settings) {
      errors.error(`${typeof settings} for settings is passed`, 1);
    }
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port} for port is passed`, 1);
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router} for router is passed`, 1);
    }
    return TCPServer._createServer(settings, options);
  }

  /**
  * @private
  * @method getServerInstance
  * @description Get tcp server instace
  * @returns {object} server - server instance
  */
  static getServerInstance() {
    return server.tcp;
  }

  /**
  * @private
  * @method getServerPort
  * @description Retrieve the port the tcp server is currently listening on
  * @returns {int} port
  */
  static getServerPort() {
    return server.port;
  }

  /**
  * @private
  * @method _createServer
  * @description Create tcp server
  * @param {object} settings - see example
  * @param {object} options (optional) - see example
  * @returns {object} server - server instance
  * @see examples
  */
  static _createServer(settings, options) {
    debug('create tcp server on port %s', settings.port);
    server.port = settings.port;
    options = options || {};
    server.tcp = net.createServer(options, settings.router);
    TCPServer._onServerCreated(settings);
    return server.tcp;
  }

  /**
  * @private
  * @method _onServerCreated
  * @description Bind on "listening" event to tcp server and call _listen
  * after that
  * @param {object} settings - see example
  */
  static _onServerCreated(settings) {
    debug('binding tcp server "listening" event');
    server.tcp.on('listening', () => {
      TCPServer._onListening(settings.onListening);
    });
    TCPServer._listen(settings);
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
    if (TCPServer._shouldListen(settings)) {
      server.tcp.listen(settings.port);
    }
  }

  /**
  * @private
  * @method _shouldListen
  * @description Determine if the server should listen when it's created.
  * The server should listen only if the cluster is not enabled or
  * this is not the master process
  * @param {object} settings - see example
  */
  static _shouldListen(settings) {
    if (!settings.cluster || !cluster.isMaster) {
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
      'createServer expects object as argument, holding port and router as '
      + ' keys. Eg: {port:3333, router: routerFunction} Caused in esrol-servers'
      + ' module, Class TCPServer',
      1
    );
  }

}

TCPServer._registerErrors();

module.exports = TCPServer;

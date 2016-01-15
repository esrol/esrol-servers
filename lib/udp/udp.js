/**
 * @author Ivaylo Ivanov
 * @private
 * @class UDPServer
 * @description Creates udp server
 * @requires dgram
 * @requires cluster
 * @requires esrol-errors
 * @requires debug
 */
'use strict';
const udp = require('dgram');
const cluster = require('cluster');
const Errors = require('esrol-errors');
const debug = require('debug')('esrol-servers:udp');
let server = new WeakMap();
let errors = new Errors();

class UDPServer {

  /**
  * @private
  * @method createServer
  * @description Wrapper for creating udp server
  * @param {object} settings - see example
  * @param {object} options (optional) - see example
  * @throws {error} error - if no settings are passed
  * @throws {error} error - if no settings.type is passed
  * @throws {error} error - if no settings.port is passed
  * @throws {error} error - if no settings.router is passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createServer(settings) {
    if (!settings) {
      errors.error(`${typeof settings} for settings is passed`, 1);
    }
    if (!settings.type) {
      errors.error(`${typeof settings.type} for type is passed`, 1);
    }
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port} for port is passed`, 1);
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router} for router is passed`, 1);
    }
    return UDPServer._createServer(settings);
  }

  /**
  * @private
  * @method getServerInstance
  * @description Get udp server instace
  * @returns {object} server - server instance
  */
  static getServerInstance() {
    return server.udp;
  }

  /**
  * @private
  * @method getServerPort
  * @description Retrieve the port the udp server is currently listening on
  * @returns {int} port
  */
  static getServerPort() {
    return server.port;
  }

  /**
  * @private
  * @method _createServer
  * @description Create udp server
  * @param {object} settings - see example
  * @returns {object} server - server instance
  * @see examples
  */
  static _createServer(settings) {
    debug('create "%s" server on port %s', settings.type, settings.port);
    server.port = settings.port;
    server.udp = udp.createSocket(settings.type, settings.router);
    UDPServer._onServerCreated(settings);
    return server.udp;
  }

  /**
  * @private
  * @method _onServerCreated
  * @description Bind on "listening" event to udp server and call _listen
  * after that
  * @param {object} settings - see example
  */
  static _onServerCreated(settings) {
    debug('binding udp server "listening" event');
    server.udp.on('listening', () => {
      UDPServer._onListening(settings.onListening);
    });
    UDPServer._listen(settings);
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
    if (UDPServer._shouldListen(settings)) {
      server.udp.bind(settings.port);
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
      'createServer expects object as argument, holding port, router and type '
      + ' as keys. Eg: {port:3333, router: routerFunction, type: "udp4"}'
      + ' Caused in esrol-servers module, Class UDPServer',
      1
    );
  }

}

UDPServer._registerErrors();

module.exports = UDPServer;

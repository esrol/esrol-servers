/**
 * @author Ivaylo Ivanov
 * @public
 * @class API
 * @description AN API Class for esrol-servers.
 * A wrapper for all esrol-servers components. Create and retrieve all
 * supported servers and trigger cluster mode
 * @requires cluster
 * @requires ./http/http
 * @requires ./https/https
 * @requires ./tcp/tcp
 * @requires ./udp/udp
 * @requires ./httpWebSocket/httpWebSocket
 * @requires ./httpsWebSocket/httpsWebSocket
 * @requires ./cluster/cluster
 */
'use strict';
let cluster = require('cluster');
let HTTP = require('./http/http');
let HTTPS = require('./https/https');
let TCP = require('./tcp/tcp');
let UDP = require('./udp/udp');
let HTTPWebSocket = require('./httpWebSocket/httpWebSocket');
let HTTPSWebSocket = require('./httpsWebSocket/httpsWebSocket');
let Cluster = require('./cluster/cluster');
let enabledServers = new WeakMap();

module.exports = class API {


  /**
  * @public
  * @method createHTTPSServer
  * @description Not implemented yet
  */
  static createHTTPSServer(settings, options) {
    return HTTPS.createServer(settings, options);
  }

  /**
  * @public
  * @method createTCPServer
  * @description Create tcp server
  * @param {object} settings - see example
  * @param {object} options - see example
  * @throws {error} error - if wrong settings are passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createTCPServer(settings, options) {
    let server = TCP.createServer(settings, options);
    enabledServers.tcpServer = true;
    return server;
  }

  /**
  * @public
  * @method createUDPServer
  * @description Create udp server
  * @param {object} settings - see example
  * @throws {error} error - if wrong settings are passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createUDPServer(settings) {
    let server = UDP.createServer(settings);
    enabledServers.udpServer = true;
    return server;
  }

  /**
  * @public
  * @method createHTTPServer
  * @description Create http server
  * @param {object} settings - see example
  * @throws {error} error - if wrong settings are passed
  * @returns {object} server - server instance
  * @see examples
  */
  static createHTTPServer(settings) {
    let server = HTTP.createServer(settings);
    enabledServers.httpServer = true;
    return server;
  }

  /**
  * @public
  * @method createHTTPWebSocket
  * @description Create http websocket
  * @param {object} server - http server instance
  * @returns {object} server - server instance
  * @see examples
  */
  static createHTTPWebSocket(server) {
    let webSocket = HTTPWebSocket.createServer(server);
    enabledServers.httpWebSocket = true;
    return webSocket;
  }

  /**
  * @public
  * @method createHTTPSWebSocket
  * @description Not implemented yet
  */
  static createHTTPSWebSocket(server) {
    return HTTPSWebSocket.createServer(server);
  }

  /**
  * @public
  * @method cluster
  * @description Trigger node cluster
  * @param {int} cores - number of cores (2, 4 etc)
  */
  static cluster(cores) {
    let servers = {
      http: {
        port: API.getHTTPServerPort(),
        server: API.getHTTPServerInstance()
      },
      https: {
        port: API.getHTTPSServerPort(),
        server: API.getHTTPSServerInstance()
      },
      httpWebSocket: enabledServers.httpWebSocket,
      httpsWebSocket: enabledServers.httpsWebSocket
    };
    Cluster.enable(servers, cores);
  }

  /**
  * @public
  * @method getHTTPServerInstance
  * @description Get http server instace
  * @returns {object} server - server instance
  */
  static getHTTPServerInstance() {
    return HTTP.getServerInstance();
  }

  /**
  * @public
  * @method getHTTPSServerInstance
  * @description Not implemented yet
  */
  static getHTTPSServerInstance() {
    return HTTPS.getServerInstance();
  }

  /**
  * @public
  * @method getHTTPWebSocketInstance
  * @description Get http websocket instance
  * @returns {object} server - websocket server instance
  */
  static getHTTPWebSocketInstance() {
    return HTTPWebSocket.getHTTPWebSocketInstance();
  }

  /**
  * @public
  * @method getUDPServerInstance
  * @description Get udp server instance
  * @returns {object} server - server instance
  */
  static getUDPServerInstance() {
    return UDP.getServerInstance();
  }

  /**
  * @public
  * @method getTCPServerInstance
  * @description Get tcp server instance
  * @returns {object} server - server instance
  */
  static getTCPServerInstance() {
    return TCP.getServerInstance();
  }

  /**
  * @public
  * @method getHTTPServerPort
  * @description Retrieve the port the http server is currently listening on
  * @returns {int} port
  */
  static getHTTPServerPort() {
    return HTTP.getServerPort();
  }

  /**
  * @public
  * @method getHTTPSServerPort
  * @description not implemented yet
  */
  static getHTTPSServerPort() {
    return HTTPS.getServerPort();
  }

  /**
  * @public
  * @method getUDPServerPort
  * @description Retrieve the port the udp server is currently listening on
  * @returns {int} port
  */
  static getUDPServerPort() {
    return UDP.getServerPort();
  }

  /**
  * @public
  * @method getTCPServerPort
  * @description Retrieve the port the tcp server is currently listening on
  * @returns {int} port
  */
  static getTCPServerPort() {
    return TCP.getServerPort();
  }

  /**
  * @public
  * @method getWorkers
  * @description Get all online workers
  * @returns {array} workers - array with all workers
  */
  static getWorkers() {
    return Cluster.getWorkers();
  }

  /**
  * @public
  * @property isMaster
  * @description the same as cluster.isMaster
  * @param {boolean} isMaster
  */
  static get isMaster() {
    return cluster.isMaster;
  }

};

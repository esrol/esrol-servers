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

module.exports = class Api {

  static createHTTPSServer(settings, options) {
    return HTTPS.createServer(settings, options);
  }

  static createTCPServer(settings, options) {
    let server = TCP.createServer(settings, options);
    enabledServers.tcpServer = true;
    return server;
  }

  static createUDPServer(settings) {
    let server = UDP.createServer(settings);
    enabledServers.udpServer = true;
    return server;
  }

  static createHTTPServer(settings) {
    let server = HTTP.createServer(settings);
    enabledServers.httpServer = true;
    return server;
  }

  static createHTTPWebSocket(server) {
    let webSocket = HTTPWebSocket.createServer(server);
    enabledServers.httpWebSocket = true;
    return webSocket;
  }

  static createHTTPSWebSocket(server) {
    return HTTPSWebSocket.createServer(server);
  }

  static cluster(cores) {
    let servers = {
      http: {
        port: Api.getHTTPServerPort(),
        server: Api.getHTTPServerInstance()
      },
      https: {
        port: Api.getHTTPSServerPort(),
        server: Api.getHTTPSServerInstance()
      },
      httpWebSocket: enabledServers.httpWebSocket,
      httpsWebSocket: enabledServers.httpsWebSocket
    };
    Cluster.enable(servers, cores);
  }

  static getHTTPServerInstance() {
    return HTTP.getServerInstance();
  }

  static getHTTPSServerInstance() {
    return HTTPS.getServerInstance();
  }

  static getHTTPWebSocketInstance() {
    return HTTPWebSocket.getHTTPWebSocketInstance();
  }

  static getUDPServerInstance() {
    return UDP.getServerInstance();
  }

  static getTCPServerInstance() {
    return TCP.getServerInstance();
  }

  static getHTTPServerPort() {
    return HTTP.getServerPort();
  }

  static getHTTPSServerPort() {
    return HTTPS.getServerPort();
  }

  static getUDPServerPort() {
    return UDP.getServerPort();
  }

  static getTCPServerPort() {
    return TCP.getServerPort();
  }

  static getWorkers() {
    return Cluster.getWorkers();
  }

  static get isMaster() {
    return cluster.isMaster;
  }

};

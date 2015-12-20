'use strict';
let socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpWebSocket {

  static createServer(httpServer) {
    server.httpWebSocket = socketIO(httpServer);
    return server.httpWebSocket;
  }

  static getHTTPWebSocketInstance() {
    return server.httpWebSocket;
  }

};

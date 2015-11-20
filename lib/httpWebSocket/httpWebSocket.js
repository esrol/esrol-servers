'use strict';
let socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpWebSocket {

  static createServer(httpServer) {
    if (!server.httpWebSocket) {
      server.httpWebSocket = socketIO(httpServer);
    }
    return server.httpWebSocket;
  }

  static getHttpWebSocketInstance() {
    return server.httpWebSocket;
  }   

};

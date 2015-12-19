'use strict';
let socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpsWebSocket {

  static createServer(httpsServer) {
    if (!server.httpsWebSocket) {
      server.httpsWebSocket = socketIO(httpsServer);
    }
    return server.httpsWebSocket;
  }

  static getHttpsWebSocketInstance() {
    return server.httpsWebSocket;
  }

};

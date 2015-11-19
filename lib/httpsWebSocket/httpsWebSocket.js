'use strict';
let cluster = require ('cluster');
let socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpsWebSocket {

  static createServer(server) {
    if (!server.httpsWebSocket) {
      server.httpsWebSocket = socketIO(server);
    }
    return server.httpsWebSocket;
  }

  static getHttpsWebSocketInstance() {
    return server.httpsWebSocket;
  }

  static _shouldListen() {
    // return ()
  }    
  
};

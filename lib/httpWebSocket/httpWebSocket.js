'use strict';
let cluster = require ('cluster');
let socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpWebSocket {

  static createServer(server) {
    if (!server.httpWebSocket) {
      server.httpWebSocket = socketIO(server);
    }
    return server.httpWebSocket;
  }

  static getHttpWebSocketInstance() {
    return server.httpWebSocket;
  }   
  
};

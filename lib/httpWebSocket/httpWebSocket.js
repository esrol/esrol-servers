/**
 * @author Ivaylo Ivanov
 * @private
 * @class API
 * @description Creates WebSocket server using socket.io
 * @requires socket.io
 */
'use strict';
const socketIO = require('socket.io');
let server = new WeakMap();

module.exports = class HttpWebSocket {

  /**
  * @private
  * @method createHTTPWebSocket
  * @description Create http websocket
  * @param {object} server - http server instance
  * @returns {object} server - http server instance
  * @see examples
  */
  static createServer(httpServer) {
    server.httpWebSocket = socketIO(httpServer);
    return server.httpWebSocket;
  }

  /**
  * @private
  * @method getHTTPWebSocketInstance
  * @description Get http websocket instance
  * @returns {object} server - websocket server instance
  */
  static getHTTPWebSocketInstance() {
    return server.httpWebSocket;
  }

};

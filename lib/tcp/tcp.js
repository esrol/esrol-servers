'use strict';
let net = require('net');
let server = new WeakMap();

module.exports = class Tcp {

  static createServer() {
    throw new Error('Currently not implemented');
  }

  static getServerInstance() {
    return server.tcp;
  }   

  static getServerPort() {
    return server.port;
  }   

};

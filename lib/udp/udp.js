'use strict';
let udp = require('dgram');
let server = new WeakMap();

module.exports = class Udp {

  static createServer() {
    throw new Error('Currently not implemented');
  }

  static getServerInstance() {
    return server.udp;
  }   

  static getServerPort() {
    return server.port;
  }   

};

'use strict';
let https = require('https');
let server = new WeakMap();

module.exports = class Https {

  static createServer() {
    throw new Error('Currently not implemented');
  }

  static getServerInstance() {
    return server.https;
  }

  static getServerPort() {
    return server.port;
  }

};

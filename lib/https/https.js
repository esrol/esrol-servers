/**
 * @author Ivaylo Ivanov
 * @private
 * @class HTTPS
 * @description Not implemented yet
 * @requires https
 */
'use strict';
const https = require('https');
let server = new WeakMap();

module.exports = class HTTPS {

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

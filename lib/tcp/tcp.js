'use strict';
let net = require('net');
let cluster = require('cluster');
let Errors = require('esrol-errors');
let server = new WeakMap();
let errors = new Errors();

class TcpServer {

  constructor() {
    errors.error('', 2);
  }  

  static createServer(settings, options) {
    if (server.tcp) {
      return server.tcp;
    }
    if (!settings) {
      errors.error(`${typeof settings}`, 1);
    }
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port}`, 1);      
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router}`, 1);      
    }        
    return TcpServer._createServer(settings, options);
  }

  static getServerInstance() {
    return server.tcp;
  }   

  static getServerPort() {
    return server.port;
  } 

  static _createServer(settings, options) {
    server.port = settings.port;
    options = options || {};
    server.tcp = net.createServer(options, settings.router);
    TcpServer._onServerCreated(settings);
    return server.tcp;    
  } 

  static _onServerCreated(settings) {
    server.tcp.on('listening', () => {
      TcpServer._onListening(settings.onListening);
    });
    TcpServer._listen(settings);
  }

  static _onListening(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  } 

  static _listen(settings) {
    if (TcpServer._shouldListen(settings)) {
      server.tcp.listen(settings.port);
    }
  } 

  static _shouldListen(settings) {
    if (!settings.cluster || !cluster.isMaster) {
      return true;
    }
    return false;
  } 

  static _registerErrors() {
    errors.registerErrorWithNumber(
      'createServer expects object as param, holding port and router as keys.' 
      + ' Eg: {port:3333, router: routerFunction} Caused in esrol-servers'
      + ' module, Class TcpServer',
      1
    );
    errors.registerErrorWithNumber(
      'TcpServer is a static class and should be accessed statically through'
      + ' createServer method. Caused in esrol-servers' 
      + ' module, Class TcpServer',
      2
    );
  }          

}

TcpServer._registerErrors();

module.exports = TcpServer;

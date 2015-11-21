'use strict';
let udp = require('dgram');
let cluster = require('cluster');
let Errors = require('esrol-errors');
let server = new WeakMap();
let errors = new Errors();

class UdpServer {

  constructor() {
    errors.error('', 2);
  }  

  static createServer(settings) {
    if (server.udp) {
      return server.udp;
    }
    if (!settings) {
      errors.error(`${typeof settings}`, 1);
    }
    if (!settings.type) {
      errors.error(`${typeof settings}`, 1);
    }    
    if (!Number.isInteger(settings.port)) {
      errors.error(`${typeof settings.port}`, 1);      
    }
    if (typeof settings.router !== 'function') {
      errors.error(`${typeof settings.router}`, 1);      
    }        
    return UdpServer._createServer(settings);
  }

  static getServerInstance() {
    return server.udp;
  }   

  static getServerPort() {
    return server.port;
  } 

  static _createServer(settings) {
    server.port = settings.port;
    server.udp = udp.createSocket(settings.type, settings.router);
    UdpServer._onServerCreated(settings);
    return server.udp;    
  } 

  static _onServerCreated(settings) {
    server.udp.on('listening', () => {
      UdpServer._onListening(settings.onListening);
    });
    UdpServer._listen(settings);
  }

  static _onListening(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  } 

  static _listen(settings) {
    if (UdpServer._shouldListen(settings)) {
      server.udp.bind(settings.port);
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
      'createServer expects object as argument, holding port, router and type ' 
      + ' as keys. Eg: {port:3333, router: routerFunction, type: "udp4"}'
      + ' Caused in esrol-servers module, Class UdpServer',
      1
    );
    errors.registerErrorWithNumber(
      'UdpServer is a static class and should be accessed statically through'
      + ' createServer method. Caused in esrol-servers' 
      + ' module, Class UdpServer',
      2
    );
  }          

}

UdpServer._registerErrors();

module.exports = UdpServer;
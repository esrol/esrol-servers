'use strict';
let Errors = require('esrol-errors');
let http = require('http');
let cluster = require('cluster');
let server = new WeakMap();
let errors = new Errors();

class HttpServer {

  constructor() {
    errors.error('', 2);
  }

  static createServer(settings) {
    if (server.http) {
      return server.http;
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
    return HttpServer._createServer(settings);
  } 

  static getServerInstance() {
    return server.http;
  } 

  static getServerPort() {
    return server.port;
  } 

  static getClusterStatus() {
    return server.cluster;
  }     

  static _createServer(settings) {
    server.cluster = settings.cluster;
    server.port = settings.port;
    server.http = http.createServer(settings.router);
    HttpServer._onServerCreated(settings);
    return server.http;
  } 

  static _onServerCreated(settings) {
    server.http.on('listening', () => {
      HttpServer._onListening(settings.onListening);
    });
    HttpServer._listen(settings);
  } 

  static _onListening(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  } 

  static _listen(settings) {
    if (HttpServer._shouldListen(settings)) {
      server.http.listen(settings.port);
    }
  } 

  static _shouldListen(settings) {
    if (!settings.cluster || (!settings.webSocket && !cluster.isMaster)) {
      return true;
    }
    return false;
  } 

  static _registerErrors() {
    errors.registerErrorWithNumber(
      'createServer expects object as argument, holding port and router as' 
      + ' keys. Eg: {port:3333, router: routerFunction} Caused in esrol-servers'
      + ' module, Class HttpServer',
      1
    );
    errors.registerErrorWithNumber(
      'HttpServer is a static class and should be accessed statically through'
      + ' createServer method. Caused in esrol-servers' 
      + ' module, Class HttpServer',
      2
    );
  } 

}

HttpServer._registerErrors();

module.exports = HttpServer;
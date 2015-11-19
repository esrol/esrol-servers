'use strict';
let Http = require('./http/http');
let Https = require('./https/https');
let Tcp = require('./tcp/tcp');
let Udp = require('./udp/udp');
let HttpWebSocket = require('./httpWebSocket/httpWebSocket');
let HttpsWebSocket = require('./httpsWebSocket/httpsWebSocket');
let Cluster = require('./cluster/cluster');
let enabledServers = new WeakMap();

module.exports = class Api {

  static createHttpsServer(settings) {
    let server = Https.createServer(settings);
    enabledServers.httpsServer = true;
    return server;
  }  

  static createTcpServer(settings) {
    let server = Tcp.createServer(settings);
    enabledServers.tcpServer = true;
    return server;
  }    

  static createUdpServer(settings) {
    let server = Udp.createServer(settings);
    enabledServers.udpServer = true;
    return server;
  }   

  static createHttpServer(settings) {
    let server = Http.createServer(settings);
    enabledServers.httpServer = true;
    return server;
  }

  static createHttpWebSocket(server) {
    let webSocket = HttpWebSocket.createServer(server);
    enabledServers.httpWebSocket = true;
    return webSocket;
  } 

  static createHttpsWebSocket(server) {
    let webSocket = HttpsWebSocket.createServer(server);
    enabledServers.httpsWebSocket = true;
    return webSocket;
  }   

  static clustering(cores) {
    let servers = {
      http: {
        port: Api.getHttpServerPort(),
        server: Api.getHttpServerInstance()
      },
      https: {
        port: Api.getHttpsServerPort(),
        server: Api.getHttpsServerInstance()       
      },
      httpWebSocket: {
        port: Api.getHttpServerPort(),
        server: Api.getHttpWebSocketInstance()
      },
      httpsWebSocket: {
        port: Api.getHttpsServerPort(),
        server: Api.getHttpsWebSocketInstance()
      }      
    };
    Cluster.enable(servers, cores);
  } 

  static getHttpServerInstance() {
    return Http.getServerInstance();
  } 

  static getHttpsServerInstance() {
    return Https.getServerInstance();    
  } 

  static getHttpWebSocketInstance() {
    return HttpWebSocket.getHttpWebSocketInstance();
  } 

  static getHttpsWebSocketInstance() {
    return HttpsWebSocket.getHttpsWebSocketInstance();    
  }   

  static getUdpServerInstance() {
    return Udp.getServerInstance();        
  } 

  static getTcpServerInstance() {
    return Tcp.getServerInstance();            
  } 

  static getHttpServerPort() {
    return Http.getServerPort();
  } 

  static getHttpsServerPort() {
    return Https.getServerPort();    
  } 

  static getUdpServerPort() {
    return Udp.getServerPort();        
  } 

  static getTcpServerPort() {
    return Tcp.getServerPort();            
  }

};

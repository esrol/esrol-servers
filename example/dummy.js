'use strict';
let Servers = require('../index.js');
let httpRouter = function(req, res) {
  res.end('hello');
};
let tcpRouter = function(socket) {
  socket.write('hello');
  socket.end();
};
let udpRouter = function(msf, info) {
  console.log(msf.toString());
};
let onHttpServerListening = function() {
  console.log('http server is listening');
};
let onTcpServerListening = function() {
  console.log('tcp server is listening');
};
let onUdpServerListening = function() {
  console.log('udp server is listening');
};
let onHttpWebSocketConnection = function(socket) {
  console.log ('http webSocket connected');
};
let httpSettings = {
  router: httpRouter,
  onListening: onHttpServerListening,
  port: 3333,
  webSocket: true,
  cluster: true
};
let tcpSettings = {
  port: 3334,
  cluster: true,
  router: tcpRouter,
  onListening: onTcpServerListening
};
let tcpOptions = {
  allowHalfOpen: false,
  pauseOnConnect: false
};
let udpSettings = {
  type: 'udp4',
  port: 3335,
  cluster: true,
  router: udpRouter,
  onListening: onUdpServerListening
};
let httpServer = Servers.createHttpServer(httpSettings);
let tcpServer = Servers.createTcpServer(tcpSettings, tcpOptions);
let udpServer = Servers.createUdpServer(udpSettings);
let httpWebSocket = Servers.createHttpWebSocket(httpServer);
httpWebSocket.on('connection', onHttpWebSocketConnection);
Servers.cluster(4); // number of cores

if (Servers.isMaster()) {
  console.log('master');
} else {
  console.log('slave');
}


'use strict';
let Servers = require('esrol-servers');
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
let onHTTPServerListening = function() {
  console.log('http server is listening');
};
let onTCPServerListening = function() {
  console.log('tcp server is listening');
};
let onUDPServerListening = function() {
  console.log('udp server is listening');
};
let onHTTPWebSocketConnection = function(socket) {
  console.log ('http webSocket connected');
};
let httpSettings = {
  router: httpRouter,
  onListening: onHTTPServerListening,
  port: 3333,
  webSocket: true,
  cluster: true
};
let tcpSettings = {
  port: 3334,
  cluster: true,
  router: tcpRouter,
  onListening: onTCPServerListening
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
  onListening: onUDPServerListening
};
let httpServer = Servers.createHTTPServer(httpSettings);
let tcpServer = Servers.createTCPServer(tcpSettings, tcpOptions);
let udpServer = Servers.createUDPServer(udpSettings);
let httpWebSocket = Servers.createHTTPWebSocket(httpServer);
httpWebSocket.on('connection', onHTTPWebSocketConnection);
Servers.cluster(4); // number of cores

if (Servers.isMaster) {
  console.log('master');
} else {
  console.log('slave');
}

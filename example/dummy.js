'use strict';
const Servers = require('esrol-servers');
const httpRouter = function(req, res) {
  res.end('hello');
};
const tcpRouter = function(socket) {
  socket.write('hello');
  socket.end();
};
const udpRouter = function(msg, info) {
  console.log(msg.toString());
};
const onHTTPServerListening = function() {
  console.log('http server is listening');
};
const onTCPServerListening = function() {
  console.log('tcp server is listening');
};
const onUDPServerListening = function() {
  console.log('udp server is listening');
};
const onHTTPWebSocketConnection = function(socket) {
  console.log ('http webSocket connected');
};
const httpSettings = {
  router: httpRouter,
  onListening: onHTTPServerListening,
  port: 3333,
  webSocket: true,
  cluster: true
};
const tcpSettings = {
  port: 3334,
  cluster: true,
  router: tcpRouter,
  onListening: onTCPServerListening
};
const tcpOptions = {
  allowHalfOpen: false,
  pauseOnConnect: false
};
const udpSettings = {
  type: 'udp4',
  port: 3335,
  cluster: true,
  router: udpRouter,
  onListening: onUDPServerListening
};
const httpServer = Servers.createHTTPServer(httpSettings);
const tcpServer = Servers.createTCPServer(tcpSettings, tcpOptions);
const udpServer = Servers.createUDPServer(udpSettings);
const httpWebSocket = Servers.createHTTPWebSocket(httpServer);
httpWebSocket.on('connection', onHTTPWebSocketConnection);
Servers.cluster(4); // number of cores

if (Servers.isMaster) {
  console.log('master');
} else {
  console.log('slave');
}

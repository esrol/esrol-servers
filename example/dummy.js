'use strict';
let Servers = require('../index.js');
let httpRouter = function(req, res) {
  res.end('hello'); 
};
let tcpRouter = function(socket) {
  socket.write('hello');
  socket.end(); 
};
let onHttpServerListening = function() {
  console.log('http server is listening');
};
let onTcpServerListening = function() {
  console.log('tcp server is listening');
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
let httpServer = Servers.createHttpServer(httpSettings);
let tcpServer = Servers.createTcpServer(tcpSettings, tcpOptions);
let httpWebSocket = Servers.createHttpWebSocket(httpServer);
httpWebSocket.on('connection', onHttpWebSocketConnection);
Servers.cluster(4); // number of cores

if (Servers.isMaster()) {
  console.log('master');
} else {
  console.log('slave');
}


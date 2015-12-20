'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');
let ioc = require('socket.io-client');
let socketIO = require('socket.io');

require('mocha-sinon');

if (cluster.isMaster) {
  let des = `HTTP WebSocket`;
  describe(des, () => {
    let should = `Should create both http and websocket servers, create a
    client, make a request to the websocket server and handshake address
    must contain "127.0.0.1" `;
    it(should, (done) => {
      let httpSettings = {
        router(req, res) {
          res.end('success');
        },
        onListening() {
          ioc('http://localhost:3433', {});
        },
        port: 3433,
        webSocket: true,
        cluster: false
      };
      let httpServer = Servers.createHTTPServer(httpSettings);
      let httpWebSocket = Servers.createHTTPWebSocket(httpServer);
      httpWebSocket.on('connection', (socket) => {
        expect(socket.handshake.address).to.contain('127.0.0.1');
        describe('Get HTTP WebSocket', () => {
          let should = `Should return the WebSocket server, which should be
          an instanceof socket.io`;
          it(should, () => {
            let webSocket = Servers.getHTTPWebSocketInstance();
            expect(webSocket instanceof socketIO).to.be.a.true;
          });
        })
        httpServer.close();
        done();
      });
    });
  });
}

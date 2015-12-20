'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');
let ioc = require('socket.io-client');
let socketIO = require('socket.io');

require('mocha-sinon');

describe('HTTP webSocket cluster', () => {

  describe('Create a simple server in cluster mode', () => {
    let should = `Should trigger "onListening" callback, receive the request
    and return "success" message`;
    it(should, (done) => {
      let finished = false;
      let httpSettings = {
        router(req, res) {
          res.end('success');
        },
        onListening() {
          setTimeout(() => {
            ioc('http://localhost:3633', {});
          }, 1000);
        },
        port: 3633,
        webSocket: true,
        cluster: true
      };
      cluster.on('message', () => {
        if (!finished) {
          done();
          finished = true;
        }
      });
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
        });
        httpServer.close();
        process.send('done');
        done();
      });
      Servers.cluster(2);
    });
  });

});

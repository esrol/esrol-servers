'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let mocks = require ('./mocks/index');
let cluster = require('cluster');
var net = require('net');

require('mocha-sinon');

describe('TCP cluster', () => {

  describe('Create a simple tcp server, send / receive socket', () => {
    it('it should send and receive a socket', (done) => {
      let finished = false;
      let tcpSettings = {
        port: 4444,
        cluster: true,
        router: (socket) => {
          socket.write('success');
          socket.end();
        },
        onListening: () => {
          var client = net.connect({port: 4444});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            tcpServer.close();
            process.send('done');
            done();
          });
        }
      };
      let tcpServer = Servers.createTcpServer(tcpSettings);
      cluster.on('message', () => {
        if (!finished) {
          done();
          finished = true;
        }
      });
    });
  });


});

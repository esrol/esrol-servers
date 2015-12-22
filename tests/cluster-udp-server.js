'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');
let dgram = require('dgram');

require('mocha-sinon');

describe('UDP cluster', () => {

  describe('Create a simple udp server, send / receive socket', () => {
    it('it should send and receive a socket', (done) => {
      let finished = false;
      let udpSettings = {
        type: 'udp4',
        port: 5441,
        cluster: true,
        router(message, info) {
          expect(message.toString()).to.equal('success');
          udpServer.close();
          process.send('done');
          done();
        },
        onListening() {
          let client = dgram.createSocket("udp4");
          let message = 'success';
          client.send(message, 0, message.length, 5441, "localhost");
        }
      };
      let udpServer = Servers.createUDPServer(udpSettings);
      cluster.on('message', () => {
        if (!finished) {
          done();
          finished = true;
        }
      });
    });
  });

});

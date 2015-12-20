'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');
var dgram = require('dgram');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('UDP success', () => {

    describe('Create a simple udp server, send / receive socket', () => {
      it('it should send and receive a socket', (done) => {
        let udpSettings = {
          type: 'udp4',
          port: 5444,
          cluster: false,
          router(message, info) {
            expect(message.toString()).to.equal('success');
            udpServer.close();
            done();
          },
          onListening() {
            let client = dgram.createSocket("udp4");
            let message = 'success';
            client.send(message, 0, message.length, 5444, "localhost");
          }
        };
        let udpServer = Servers.createUDPServer(udpSettings);
      });
    });

    describe('Create a simple udp using custom hardcoded listener', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let udpSettings = {
          type: 'udp4',
          port: 5445,
          cluster: false,
          router(message, info) {
            expect(message.toString()).to.equal('success');
            udpServer.close();
            done();
          }
        };
        let udpServer = Servers.createUDPServer(udpSettings);
        udpServer.on('listening', () => {
          let client = dgram.createSocket("udp4");
          let message = 'success';
          client.send(message, 0, message.length, 5445, "localhost");
        });
      });
    });

    describe('Get the udp server instance through the api', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let udpSettings = {
          type: 'udp4',
          port: 5446,
          cluster: false,
          router(message, info) {
            expect(message.toString()).to.equal('success');
            Servers.getUDPServerInstance().close();
            done();
          }
        };
        Servers.createUDPServer(udpSettings);
        Servers.getUDPServerInstance().on('listening', () => {
          let client = dgram.createSocket("udp4");
          let message = 'success';
          client.send(message, 0, message.length, 5446, "localhost");
        });
      });
    });

    describe('Get the udp server port through the api', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let udpSettings = {
          type: 'udp4',
          port: 5447,
          cluster: false,
          router(message, info) {
            expect(message.toString()).to.equal('success');
            expect(Servers.getUDPServerPort()).to.equal(5447);
            Servers.getUDPServerInstance().close();
            done();
          }
        };
        Servers.createUDPServer(udpSettings);
        Servers.getUDPServerInstance().on('listening', () => {
          let client = dgram.createSocket("udp4");
          let message = 'success';
          client.send(message, 0, message.length, 5447, "localhost");
        });
      });
    });

  });

  describe('UDP fail', () => {
    let should = 'Should throw an error';

    describe('Passing a non object as argument to "createUDPServer"', () => {
      it(should, () => {
        expect(() => {
          Servers.createUDPServer(undefined);
        }).to.throw(Error);
      });
    });

    let desType = `Passing object without port type to "createUDPServer"`;
    describe(desType, () => {
      it(should, () => {
        expect(() => {
          Servers.createUDPServer({});
        }).to.throw(Error);
      });
    });

    let desPort = `Passing object without port property to "createUDPServer"`;
    describe(desPort, () => {
      it(should, () => {
        expect(() => {
          Servers.createUDPServer({type: 'udp4'});
        }).to.throw(Error);
      });
    });

    let desRouter = `Passing {} without router property to "createUDPServer"`;
    describe(desRouter, () => {
      it(should, () => {
        expect(() => {
          Servers.createUDPServer({type: 'udp4', port: 5448});
        }).to.throw(Error);
      });
    });

  });

}

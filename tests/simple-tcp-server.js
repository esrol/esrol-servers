'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');
var net = require('net');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('TCP success', () => {

    describe('Create a simple tcp server, send / receive socket', () => {
      it('it should send and receive a socket', (done) => {
        let tcpSettings = {
          port: 4444,
          cluster: false,
          router(socket) {
            socket.write('success');
            socket.end();
          },
          onListening() {
            var client = net.connect({port: 4444});
            client.on('data', function(data) {
              expect(data.toString()).to.equal('success');
              tcpServer.close();
              done();
            });
          }
        };
        let tcpServer = Servers.createTCPServer(tcpSettings);
      });
    });

    describe('Create a simple tcp using custom hardcoded listener', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let tcpSettings = {
          port: 4445,
          cluster: false,
          router(socket) {
            socket.write('success');
            socket.end();
          }
        };
        let tcpServer = Servers.createTCPServer(tcpSettings);
        tcpServer.on('listening', () => {
          var client = net.connect({port: 4445});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            tcpServer.close();
            done();
          });
        });
      });
    });

    describe('Get the tcp server instance through the api', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let tcpSettings = {
          port: 4446,
          cluster: false,
          router(socket) {
            socket.write('success');
            socket.end();
          }
        };
        Servers.createTCPServer(tcpSettings);
        Servers.getTCPServerInstance().on('listening', () => {
          var client = net.connect({port: 4446});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            Servers.getTCPServerInstance().close();
            done();
          });
        });
      });

    });

    describe('Get the tcp server port through the api', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let tcpSettings = {
          port: 4447,
          cluster: false,
          router(socket) {
            socket.write('success');
            socket.end();
          }
        };
        Servers.createTCPServer(tcpSettings);
        Servers.getTCPServerInstance().on('listening', () => {
          var client = net.connect({port: 4447});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            expect(Servers.getTCPServerPort()).to.equal(4447);
            Servers.getTCPServerInstance().close();
            done();
          });
        });
      });
    });

  });

  describe('TCP fail', () => {
    let should = 'Should throw an error';

    describe('Passing a non object as argument to "createTCPServer"', () => {
      it(should, () => {
        expect(() => {
          Servers.createTCPServer(undefined);
        }).to.throw(Error);
      });
    });

    let desPort = `Passing object without port property to "createTCPServer"`;
    describe(desPort, () => {
      it(should, () => {
        expect(() => {
          Servers.createTCPServer({});
        }).to.throw(Error);
      });
    });

    let desRouter = `Passing {} without router property to "createTCPServer"`;
    describe(desRouter, () => {
      it(should, () => {
        expect(() => {
          Servers.createTCPServer({port: 4448});
        }).to.throw(Error);
      });
    });

  });

}

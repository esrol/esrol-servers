'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let mocks = require ('./mocks/index');
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
          router: (socket) => {
            socket.write('success');
            socket.end();
          },
          onListening: () => {
            var client = net.connect({port: 4444});
            client.on('data', function(data) {
              expect(data.toString()).to.equal('success');
              tcpServer.close();
              done();
            });
          }
        };
        let tcpServer = Servers.createTcpServer(tcpSettings);
      });
    });

    describe('Create a simple tcp using custom hardcoded listener', () => {
      let should = 'Should consume socket through the hardcoded listener';
      it(should, (done) => {
        let tcpSettings = {
          port: 4445,
          cluster: false,
          router: (socket) => {
            socket.write('success');
            socket.end();
          }
        };
        let tcpServer = Servers.createTcpServer(tcpSettings);
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
          router: (socket) => {
            socket.write('success');
            socket.end();
          }
        };
        Servers.createTcpServer(tcpSettings);
        Servers.getTcpServerInstance().on('listening', () => {
          var client = net.connect({port: 4446});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            Servers.getTcpServerInstance().close();
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
          router: (socket) => {
            socket.write('success');
            socket.end();
          }
        };
        Servers.createTcpServer(tcpSettings);
        Servers.getTcpServerInstance().on('listening', () => {
          var client = net.connect({port: 4447});
          client.on('data', function(data) {
            expect(data.toString()).to.equal('success');
            expect(Servers.getTcpServerPort()).to.equal(4447);
            Servers.getTcpServerInstance().close();
            done();
          });
        });
      });
    });

  });

  describe('TCP fail', () => {
    let should = 'Throw an error';

    describe('Passing a non object as argument to "createTcpServer"', () => {
      it(should, () => {
        expect(() => {
          Servers.createTcpServer(undefined);
        }).to.throw(Error);
      });
    });

    let desPort = `Passing object without port property to "createTcpServer"`;
    describe(desPort, () => {
      it(should, () => {
        expect(() => {
          Servers.createTcpServer({});
        }).to.throw(Error);
      });
    });

    let desRouter = `Passing object without router property to "createTcpServer"`;
    describe(desRouter, () => {
      it(should, () => {
        expect(() => {
          Servers.createTcpServer({port: 4448});
        }).to.throw(Error);
      });
    });

  });
}

'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let request = require('request');
let cluster = require('cluster');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('HTTP success', () => {

    describe('Create a simple http server', () => {
      let should = `Should trigger "onListening" callback, receive the request
      and return "success" message`;
      it(should, (done) => {
        let httpSettings = {
          router(req, res) {
            res.end('success');
          },
          onListening() {
            request('http://localhost:3332', (err, response) => {
              expect(response.body).to.equal('success');
              httpServer.close();
              done();
            });
          },
          port: 3332,
          webSocket: false,
          cluster: false
        };
        let httpServer = Servers.createHTTPServer(httpSettings);
      });
    });

    describe('Create a simple http using custom hardcoded listener', () => {
      let should = 'Should consume req through the hardcoded listener';
      it(should, (done) => {
        let httpSettings = {
          port: 3333,
          webSocket: false,
          cluster: false,
          router(req, res) {
            res.end('success');
          },
        };
        let httpServer = Servers.createHTTPServer(httpSettings);
        httpServer.on('listening', () => {
          request('http://localhost:3333', (err, response) => {
            expect(response.body).to.equal('success');
            httpServer.close();
            done();
          });
        });
      });
    });

    describe('Get the http server instance through the api', () => {
      let should = 'Should consume req through the hardcoded listener';
      it(should, (done) => {
        let httpSettings = {
          port: 3334,
          webSocket: false,
          cluster: false,
          router(req, res) {
            res.end('success');
          },
        };
        Servers.createHTTPServer(httpSettings);
        Servers.getHTTPServerInstance().on('listening', () => {
          request('http://localhost:3334', (err, response) => {
            expect(response.body).to.equal('success');
            Servers.getHTTPServerInstance().close();
            done();
          });
        });
      });
    });

    describe('Get the http server port through the api', () => {
      let should = 'Should consume req through the hardcoded listener';
      it(should, (done) => {
        let httpSettings = {
          port: 3335,
          webSocket: false,
          cluster: false,
          router(req, res) {
            res.end('success');
          },
        };
        Servers.createHTTPServer(httpSettings);
        Servers.getHTTPServerInstance().on('listening', () => {
          request('http://localhost:3335', (err, response) => {
            expect(response.body).to.equal('success');
            expect(Servers.getHTTPServerPort()).to.equal(3335);
            Servers.getHTTPServerInstance().close();
            done();
          });
        });
      });
    });

  });

  describe('HTTP fail', () => {
    let should = 'Should throw an error';

    describe('Passing a non object as argument to "createHTTPServer"', () => {
      it(should, () => {
        expect(() => {
          Servers.createHTTPServer(undefined);
        }).to.throw(Error);
      });
    });

    let desPort = `Passing object without port property to "createHTTPServer"`;
    describe(desPort, () => {
      it(should, () => {
        expect(() => {
          Servers.createHTTPServer({});
        }).to.throw(Error);
      });
    });

    let desRouter = `Passing {} without router property to "createHTTPServer"`;
    describe(desRouter, () => {
      it(should, () => {
        expect(() => {
          Servers.createHTTPServer({port: 4448});
        }).to.throw(Error);
      });
    });

  });

}

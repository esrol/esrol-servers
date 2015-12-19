'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let mocks = require ('./mocks/index');
let request = require('request');
let cluster = require('cluster');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('Create a simple http server', () => {
    let should = `Should trigger "onListening" callback, receive the request
    and return "success" message`;
    it(should, (done) => {
      let httpSettings = {
        router: (req, res) => {
          res.end('success');
        },
        onListening: () => {
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
      let httpServer = Servers.createHttpServer(httpSettings);
    });
  });
}

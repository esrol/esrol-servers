'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let mocks = require ('./mocks/index');
let request = require('request');
let cluster = require('cluster');

require('mocha-sinon');

describe('HTTP cluster', () => {

  describe('Create a simple server in cluster mode', () => {
    let should = `Should trigger "onListening" callback, receive the request
    and return "success" message`;
    it(should, (done) => {
      let finished = false;
      let httpSettings = {
        router: (req, res) => {
          res.end('success');
        },
        onListening: () => {
          request('http://localhost:3333', (err, response) => {
            expect(response.body).to.equal('success');
            httpServer.close();
            process.send('done');
            done();
          });
        },
        port: 3333,
        webSocket: false,
        cluster: true
      };
      cluster.on('message', () => {
        if (!finished) {
          done();
          finished = true;
        }
      });
      let httpServer = Servers.createHttpServer(httpSettings);
      Servers.cluster(2);
    });
  });

});

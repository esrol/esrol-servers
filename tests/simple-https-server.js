'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('HTTPS fail', () => {
    describe('Trying to create HTTPS server', () => {
      it('Should throw an error', () => {
        expect(() => {
          Servers.createHTTPSServer();
        }).to.throw(Error);
      });
    });
  });
}
'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');

if (Servers.isMaster) {
  describe('HTTPS WebSocket', () => {
    describe('HTTPS WebSocket fail', () => {
      describe('Trying to create HTTPS WebSocket', () => {
        it('Should throw an error', () => {
          expect(() => {
            Servers.createHTTPSWebSocket(undefined);
          }).to.throw(Error);
        });
      });
    });
  });
}

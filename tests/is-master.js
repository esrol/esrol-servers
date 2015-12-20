'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');

if (cluster.isMaster) {
  describe('API cluster', () => {
    describe('Check if it is "master" through the API', () => {
      it('"Servers.isMaster" should return true ', () => {
        expect(Servers.isMaster).to.be.a.true;
      });
    });
  });
} else {
  it('"Servers.isMaster" should return false', () => {
    expect(Servers.isMaster).to.be.a.false;
  });
}

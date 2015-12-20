'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('API "getWorkers"', () => {
    describe('Get workers number through the API - "getWorkers"', () => {
      it('Should not be "0", since we have multiple cluster tests', () => {
        expect(Servers.getWorkers().length).to.not.equal(0);
      });
    });
  });
}

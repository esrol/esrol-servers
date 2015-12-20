'use strict';
let expect = require('chai').expect;
let Servers = require('../index.js');
let cluster = require('cluster');

require('mocha-sinon');

if (cluster.isMaster) {
  describe('API "getWorkers"', () => {
    describe('Get workers number through the API - "getWorkers"', () => {
      it('Should return "2" - all tests are with 2 cpus', () => {
        expect(Servers.getWorkers().length).to.equal(2);
      });
    });
  });
}

'use strict';
let cluster = require('cluster');
let net = require('net');
let stringHash = require('string-hash');
let debug = require('debug')('esrol-servers:cluster');
let wm = new WeakMap();
wm.workers = [];

module.exports = class Cluster {

  static enable(servers, cores) {
    if (Cluster._needBalancer(servers)) {
      let webServers = {};
      if (servers.http.server) {
        webServers[servers.http.port] = {};
        webServers[servers.http.port].protocol = 'http';
        webServers[servers.http.port].server = servers.http.server;
      }
      // todo - implement https
      return Cluster._runBalancerCluster(webServers, cores);
    }
    return Cluster._runNormalCluster(cores);
  }

  static _needBalancer(servers) {
    if (servers.http.server && servers.httpWebSocket) {
      return true;
    }
    // todo - implement https
    return false;
  }

  static _runBalancerCluster(servers, cores) {
    /* istanbul ignore else  */
    if (cluster.isMaster) {
      for (let port in servers) {
        Cluster._master(port, servers[port].protocol);
        Cluster._emitListening(servers[port].server, cores);
      }
      return Cluster._fork(cores);
    } else {
      Cluster._slave(servers);
    }
  }

  static _runNormalCluster(cores) {
    /* istanbul ignore else */
    if (cluster.isMaster) {
      Cluster._fork(cores);
    }
  }

  static _onForked(worker) {
    wm.workers.push(worker);
    debug('Worker with id "%s" was just spawned', worker.id);
    worker.on('exit', () => {
      Cluster._onWorkerExit(worker);
    });
  }

  static _onWorkerExit(worker) {
    var index = wm.workers.indexOf(worker);
    debug('Worker with id "%s" just exist', worker.id);
    if (index !== -1) {
      wm.workers.splice(index, 1);
    }
    Cluster._fork(1);
  }

  static _fork(cores) {
    var worker;
    for (var i = 0; i < cores; i++) {
      worker = cluster.fork();
      Cluster._onForked(worker);
    }
  }

  static _slave(servers) {
    /* istanbul ignore next */
    process.on('message', (message, socket) => {
      if (message.indexOf('sticky:balance') !== 0 || !socket) {
        return;
      }
      var port = message.split(':')[2];
      servers[port].server.emit('connection', socket);
    });
  }

  static _master(port, protocol) {
    let options = { pauseOnConnect: true };
    debug('Initializing proxy server for "%s" on port "%s"', protocol, port);
    net.createServer(options, function(socket) {
      Cluster._balancer(socket, port);
    }).listen(port);
  }

  static _balancer(socket, port) {
    var hash = Cluster._getHash(socket.remoteAddress || '127.0.0.1');
    var workerId = hash % wm.workers.length;
    debug('Sending socket to worker');
    wm.workers[workerId].send('sticky:balance:' + port, socket);
  }

  static _emitListening(server, cores) {
    for (let i = 0; i < cores; i++) {
      server.emit('listening', 'listening');
    }
  }

  static _getHash(string) {
    return stringHash(string);
  }

  static getWorkers() {
    return wm.workers;
  }

};
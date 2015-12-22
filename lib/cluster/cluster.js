/**
 * @author Ivaylo Ivanov
 * @private
 * @class Cluster
 * @description A cluster wrapper for triggering node cluster in different
 * scenarios
 * @requires cluster
 * @requires net
 * @requires string-hash
 * @requires debug
 */
'use strict';
let cluster = require('cluster');
let net = require('net');
let stringHash = require('string-hash');
let debug = require('debug')('esrol-servers:cluster');
let wm = new WeakMap();
wm.workers = [];

module.exports = class Cluster {

  /**
  * @private
  * @method enable
  * @description Dispatch to balancer
  * @param {object} servers - http and https servers
  * @param {int} cores
  */
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

  /**
  * @private
  * @method _needBalancer
  * @description Determine the necessity of balancer
  * @param {object} servers - http and https servers
  * @returns {boolean} true / false
  */
  static _needBalancer(servers) {
    if (servers.http.server && servers.httpWebSocket) {
      return true;
    }
    // todo - implement https
    return false;
  }

  /**
  * @private
  * @method _runBalancerCluster
  * @description Run custom cluster
  * @param {object} servers - http and https servers
  * @param {int} cores
  */
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

  /**
  * @private
  * @method _runNormalCluster
  * @description Run normal cluster aka node cluster.fork
  * @param {int} cores
  */
  static _runNormalCluster(cores) {
    /* istanbul ignore else */
    if (cluster.isMaster) {
      Cluster._fork(cores);
    }
  }

  /**
  * @private
  * @method _onForked
  * @description Bind on "exit" event and call _onWorkerExit when triggered
  * @param {object} worker - the spawned worker
  */
  static _onForked(worker) {
    wm.workers.push(worker);
    debug('Worker with id "%s" was just spawned', worker.id);
    worker.on('exit', () => {
      Cluster._onWorkerExit(worker);
    });
  }

  /**
  * @private
  * @method _onWorkerExit
  * @description Remove the worker from the array list, call _fork for new one
  * @param {object} worker
  */
  static _onWorkerExit(worker) {
    var index = wm.workers.indexOf(worker);
    debug('Worker with id "%s" just exist', worker.id);
    if (index !== -1) {
      wm.workers.splice(index, 1);
    }
    Cluster._fork(1);
  }

  /**
  * @private
  * @method _fork
  * @description Fork as many cores passed as arg
  * and send the new worker to _onForked
  * @param {int} cores
  */
  static _fork(cores) {
    var worker;
    for (var i = 0; i < cores; i++) {
      worker = cluster.fork();
      Cluster._onForked(worker);
    }
  }

  /**
  * @private
  * @method _slave
  * @description Part of the custom balancer. Bind on "message" listener and
  * on message from master, pass the socket to the appropriate server using
  * the port passed with the emitted message
  * @param {object}
  * @param {int}
  */
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

  /**
  * @private
  * @method _master
  * @description Part of the custom balancer. Create tcp proxy server in master
  * and on socket, pass it to the _balancer
  * @param {port} port - 3333 / 3213 / etc
  * @param {string} protocol - http / https - https is not implemented yet
  */
  static _master(port, protocol) {
    let options = { pauseOnConnect: true };
    debug('Initializing proxy server for "%s" on port "%s"', protocol, port);
    net.createServer(options, function(socket) {
      Cluster._balancer(socket, port);
    }).listen(port);
  }

  /**
  * @private
  * @method _balancer
  * @description Pass the socket to the appropriate worker - binded in _slave
  * method
  * @param {object} socket
  * @param {int} port
  */
  static _balancer(socket, port) {
    var hash = Cluster._getHash(socket.remoteAddress || '127.0.0.1');
    var workerId = hash % wm.workers.length;
    debug('Sending socket to worker');
    wm.workers[workerId].send('sticky:balance:' + port, socket);
  }

  /**
  * @private
  * @method _emitListening
  * @description When server is created, emit to the child as much times as
  * cores are
  * @param {object} server - child server istance passed to this module
  * @param {int} cores
  */
  static _emitListening(server, cores) {
    for (let i = 0; i < cores; i++) {
      server.emit('listening', 'listening');
    }
  }

  /**
  * @private
  * @method _getHash
  * @description Create a hash from string
  * @param {string} string
  * @returns {string} hash
  * @see {@link https://github.com/darkskyapp/string-hash}
  */
  static _getHash(string) {
    return stringHash(string);
  }

  /**
  * @private
  * @method getWorkers
  * @description Get the current collection of workers
  * @returns {array} workers
  */
  static getWorkers() {
    return wm.workers;
  }

};
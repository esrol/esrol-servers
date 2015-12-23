[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

# esrol-servers
A wrapper for creating single / multiple server types (http, udp, websocket) with or without node cluster.

*Part of [Esrol](https://github.com/esrol/esrol)*

## Installation

```sh
$ npm install --save esrol-servers
```
## Node Version Compatibility

| Node Version |
| ---- |
| >= 4.x |

## Examples

```js
'use strict';
let Servers = require('esrol-servers');
let httpRouter = function(req, res) {
  res.end('hello');
};
let tcpRouter = function(socket) {
  socket.write('hello');
  socket.end();
};
let udpRouter = function(msf, info) {
  console.log(msf.toString());
};
let onHTTPServerListening = function() {
  console.log('http server is listening');
};
let onTCPServerListening = function() {
  console.log('tcp server is listening');
};
let onUDPServerListening = function() {
  console.log('udp server is listening');
};
let onHTTPWebSocketConnection = function(socket) {
  console.log ('http webSocket connected');
};
let httpSettings = {
  router: httpRouter,
  onListening: onHTTPServerListening,
  port: 3333,
  webSocket: true,
  cluster: true
};
let tcpSettings = {
  port: 3334,
  cluster: true,
  router: tcpRouter,
  onListening: onTCPServerListening
};
let tcpOptions = {
  allowHalfOpen: false,
  pauseOnConnect: false
};
let udpSettings = {
  type: 'udp4',
  port: 3335,
  cluster: true,
  router: udpRouter,
  onListening: onUDPServerListening
};
let httpServer = Servers.createHTTPServer(httpSettings);
let tcpServer = Servers.createTCPServer(tcpSettings, tcpOptions);
let udpServer = Servers.createUDPServer(udpSettings);
let httpWebSocket = Servers.createHTTPWebSocket(httpServer);
httpWebSocket.on('connection', onHTTPWebSocketConnection);
Servers.cluster(4); // number of cores

if (Servers.isMaster) {
  console.log('master');
} else {
  console.log('slave');
}

```
## API
<dl>
<dt><a href="#API">API</a></dt>
<dd></dd>
</dl>
## Members
<dl>
<dt><a href="#isMaster">isMaster</a></dt>
<dd><p>the same as node cluster.isMaster</p>
</dd>
</dl>
## Methods
<dl>
<dt><a href="#createHTTPSServer">createHTTPSServer()</a></dt>
<dd><p>Not implemented yet</p>
</dd>
<dt><a href="#createTCPServer">createTCPServer(settings, options)</a> ⇒ <code>object</code></dt>
<dd><p>Create tcp server</p>
</dd>
<dt><a href="#createUDPServer">createUDPServer(settings)</a> ⇒ <code>object</code></dt>
<dd><p>Create udp server</p>
</dd>
<dt><a href="#createHTTPServer">createHTTPServer(settings)</a> ⇒ <code>object</code></dt>
<dd><p>Create http server</p>
</dd>
<dt><a href="#createHTTPWebSocket">createHTTPWebSocket(server)</a> ⇒ <code>object</code></dt>
<dd><p>Create http websocket</p>
</dd>
<dt><a href="#createHTTPSWebSocket">createHTTPSWebSocket()</a></dt>
<dd><p>Not implemented yet</p>
</dd>
<dt><a href="#cluster">cluster(cores)</a></dt>
<dd><p>Trigger node cluster</p>
</dd>
<dt><a href="#getHTTPServerInstance">getHTTPServerInstance()</a> ⇒ <code>object</code></dt>
<dd><p>Get http server instace</p>
</dd>
<dt><a href="#getHTTPSServerInstance">getHTTPSServerInstance()</a></dt>
<dd><p>Not implemented yet</p>
</dd>
<dt><a href="#getHTTPWebSocketInstance">getHTTPWebSocketInstance()</a> ⇒ <code>object</code></dt>
<dd><p>Get http websocket instance</p>
</dd>
<dt><a href="#getUDPServerInstance">getUDPServerInstance()</a> ⇒ <code>object</code></dt>
<dd><p>Get udp server instance</p>
</dd>
<dt><a href="#getTCPServerInstance">getTCPServerInstance()</a> ⇒ <code>object</code></dt>
<dd><p>Get tcp server instance</p>
</dd>
<dt><a href="#getHTTPServerPort">getHTTPServerPort()</a> ⇒ <code>int</code></dt>
<dd><p>Retrieve the port the http server is currently listening on</p>
</dd>
<dt><a href="#getHTTPSServerPort">getHTTPSServerPort()</a></dt>
<dd><p>not implemented yet</p>
</dd>
<dt><a href="#getUDPServerPort">getUDPServerPort()</a> ⇒ <code>int</code></dt>
<dd><p>Retrieve the port the udp server is currently listening on</p>
</dd>
<dt><a href="#getTCPServerPort">getTCPServerPort()</a> ⇒ <code>int</code></dt>
<dd><p>Retrieve the port the tcp server is currently listening on</p>
</dd>
<dt><a href="#getWorkers">getWorkers()</a> ⇒ <code>array</code></dt>
<dd><p>Get all online workers</p>
</dd>
</dl>
<a name="API"></a>
## API
<a name="new_API_new"></a>
AN API Static Class for esrol-servers.
A wrapper for all esrol-servers components. Create and retrieve all
supported servers and trigger cluster mode

<a name="createHTTPSServer"></a>
## createHTTPSServer()
Not implemented yet

<a name="createTCPServer"></a>
## createTCPServer(settings, options) ⇒ <code>object</code>
Create tcp server

**Returns**: <code>object</code> - server - server instance

**Throws**:<code>error</code> - error - if wrong settings are passed


| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | see example |
| options | <code>object</code> | see example |

**See**: <a href="#examples">Examples</a>

<a name="createUDPServer"></a>
## createUDPServer(settings) ⇒ <code>object</code>
Create udp server

**Returns**: <code>object</code> - server - server instance

**Throws**: <code>error</code> - error - if wrong settings are passed


| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | see example |

**See**: <a href="#examples">Examples</a>

<a name="createHTTPServer"></a>
## createHTTPServer(settings) ⇒ <code>object</code>
Create http server

**Returns**: <code>object</code> - server - server instance

**Throws**: <code>error</code> - error - if wrong settings are passed


| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | see example |

**See**: <a href="#examples">Examples</a>

<a name="createHTTPWebSocket"></a>
## createHTTPWebSocket(server) ⇒ <code>object</code>
Create http websocket

**Returns**: <code>object</code> - server - server instance


| Param | Type | Description |
| --- | --- | --- |
| server | <code>object</code> | http server instance |

**See**: <a href="#examples">Examples</a>

<a name="createHTTPSWebSocket"></a>
## createHTTPSWebSocket()
Not implemented yet

<a name="cluster"></a>
## cluster(cores)
Trigger node cluster


| Param | Type | Description |
| --- | --- | --- |
| cores | <code>int</code> | number of cores (2, 4 etc) |

<a name="getHTTPServerInstance"></a>
## getHTTPServerInstance() ⇒ <code>object</code>
Get http server instace

**Returns**: <code>object</code> - server - server instance
<a name="getHTTPSServerInstance"></a>
## getHTTPSServerInstance()
Not implemented yet

<a name="getHTTPWebSocketInstance"></a>
## getHTTPWebSocketInstance() ⇒ <code>object</code>
Get http websocket instance

**Returns**: <code>object</code> - server - websocket server instance
<a name="getUDPServerInstance"></a>
## getUDPServerInstance() ⇒ <code>object</code>
Get udp server instance

**Returns**: <code>object</code> - server - server instance
<a name="getTCPServerInstance"></a>
## getTCPServerInstance() ⇒ <code>object</code>
Get tcp server instance

**Returns**: <code>object</code> - server - server instance
<a name="getHTTPServerPort"></a>
## getHTTPServerPort() ⇒ <code>int</code>
Retrieve the port the http server is currently listening on

**Returns**: <code>int</code> - port
<a name="getHTTPSServerPort"></a>
## getHTTPSServerPort()
not implemented yet

<a name="getUDPServerPort"></a>
## getUDPServerPort() ⇒ <code>int</code>
Retrieve the port the udp server is currently listening on

**Returns**: <code>int</code> - port
<a name="getTCPServerPort"></a>
## getTCPServerPort() ⇒ <code>int</code>
Retrieve the port the tcp server is currently listening on

**Returns**: <code>int</code> - port
<a name="getWorkers"></a>
## getWorkers() ⇒ <code>array</code>
Get all online workers

**Returns**: <code>array</code> - workers - array with all workers

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](https://github.com/esrol/esrol-servers/blob/master/LICENSE)



[npm-image]: https://badge.fury.io/js/esrol-servers.svg
[npm-url]: https://npmjs.org/package/esrol-servers
[travis-image]: https://travis-ci.org/esrol/esrol-servers.svg?branch=master
[travis-url]: https://travis-ci.org/esrol/esrol-servers
[coveralls-image]: https://coveralls.io/repos/esrol/esrol-servers/badge.svg
[coveralls-url]: https://coveralls.io/r/esrol/esrol-servers

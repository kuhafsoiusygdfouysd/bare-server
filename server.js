const http = require('http');
const { createServer } = require('@tomphttp/bare-server-node');

const server = http.createServer();
const bareServer = createServer('/bare/');

server.on('request', (request, response) => {
  if (bareServer.shouldRoute(request)) {
    bareServer.routeRequest(request, response);
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('BARE Server is running!');
  }
});

server.on('upgrade', (request, socket, head) => {
  if (bareServer.shouldRoute(request)) {
    bareServer.routeUpgrade(request, socket, head);
  } else {
    socket.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`BARE Server running on http://localhost:${PORT}`);
  console.log(`Bare endpoint: http://localhost:${PORT}/bare/`);
});

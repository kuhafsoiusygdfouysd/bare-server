import BareServer from '@tomphttp/bare-server-node';
import http from 'http';

const server = http.createServer();
const bareServer = new BareServer('/bare/', {
  logErrors: true,
  clientError: (error, socket) => {
    console.error('Client Error:', error);
    socket.end('HTTP/1.1 500 Internal Server Error\r\n\r\n');
  },
  serverError: (error, socket) => {
    console.error('Server Error:', error);
    socket.end('HTTP/1.1 500 Internal Server Error\r\n\r\n');
  }
});

server.on('request', (request, response) => {
  if (bareServer.shouldRoute(request)) {
    bareServer.routeRequest(request, response);
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('BARE Server Running');
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
  console.log(`BARE Server running on port ${PORT}`);
});

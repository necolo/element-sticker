require('dotenv').config();
const static = require('node-static');
const http = require('http');
const path = require('path');
const logger = require('pino-http')();
const datastore = require('./datastore');
const { uploadHandler, thumbnailHandler } = require('./matrix-api');
const { scanUser } = require('./scan-users');
const staticHandler = new static.Server(path.join(__dirname, '../dist'));

function parseBody (req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(data)));
  });
};

setInterval(scanUser, 60 * 1000);

const server = http.createServer(async (req, res) => {
  logger(req, res);
  if (req.url === '/api/upload') {
    return uploadHandler(req, res);
  }
  if (req.url.startsWith('/mxc')) {
    return thumbnailHandler(req, res);
  }
  if (!req.url.startsWith('/api')) {
    return staticHandler.serve(req, res);
  }
  if (req.method !== 'POST') {
    res.writeHead(400);
    return res.end(`bad method ${req.method}`);
  }
  try {
    const { action, data } = await parseBody(req);
    const result = await datastore[action in datastore ? action : 'getAll'](data);
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead('500');
    res.end('error occurred');
    console.error(err);
  }
});

const port = 8089;
server.listen(port);
console.log(`listening on port http://127.0.0.1:${port}`);

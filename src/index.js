require('dotenv').config();
const static = require('node-static');
const http = require('http');
const path = require('path');
const datastore = require('./datastore');
const { uploadHandler, thumbnailHandler } = require('./matrix-api');
const staticHandler = new static.Server(path.join(__dirname, '../dist'));


function parseBody (req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(data)));
  });
};

http.createServer(async (req, res) => {
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
}).listen(8089);

const static = require('node-static');
const http = require('http');
const path = require('path');
const datastore = require('./datastore');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(data)));
  });
}
const staticHandler = new static.Server(path.join(__dirname, 'frontend'));

http.createServer(async (req, res) => {
  if (!req.url.startsWith('/api')) {
    return staticHandler.serve(req, res);
  }
  if (req.method !== 'POST') {
    res.writeHead(400);
    return res.end(`bad method ${eq.method}`);
  }
  if (req.url === '/api/upload') {
    return res.end(JSON.stringify({ url: 'mxc://maunium.net/VAxTbCeSnnntDqPAennfRhsr' }));
  }
  const { action, data } = await parseBody(req);
  const result = await datastore[action in datastore ? action : 'getAll'](data);
  res.end(JSON.stringify(result));

}).listen(8089);

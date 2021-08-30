const http = require('http');
const https = require('https');

const httx = process.env.HOMESERVER_URL.startsWith('https:') ? https : http;

function getHeaders(req) {
  const h = { ...req.headers };
  delete h.host;
  return h;
}

exports.uploadHandler = function (req, res) {
  const url = `${process.env.HOMESERVER_URL}/_matrix/media/r0/upload`;
  const opts = {
    method: 'POST',
    headers: {
      ...getHeaders(req),
      Authorization: 'Bearer ' + process.env.ACCESS_TOKEN,
    },
  };
  const request = httx.request(url, opts, (response) => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res);
  });
  req.pipe(request);
};

exports.thumbnailHandler = function (req, res) {
  req.pipe(httx.request(`${process.env.HOMESERVER_URL}/_matrix/media/r0/thumbnail${req.url.substr(4)}`,
  { headers: getHeaders(req) }, (response) => {
    res.writeHead(response.statusCode, response.headers);
    response.pipe(res);
  }));
};

exports.setSticker = function (userId, token, data) {
  const url = `${process.env.HOMESERVER_URL}/_matrix/client/r0/user/${userId}/account_data/m.widgets`;
  const opts = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  return new Promise((resolve, reject) => {
    const req = httx.request(url, opts, async (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`status code is ${res.statusCode}`));
      }
    });
    req.on('error', reject);
    req.end(data);
  });
};

const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { createReadStream } = fs;
const server = new http.Server();
const { pipeline } = require('stream');

class PathNotExists extends Error {
  constructor() {
    super();
  }
}
const set500 = (res) => {
  res.statusCode = 500;
  res.end('Server error');
}

const set404 = (res) => {
  res.statusCode = 404;
  res.end('File not found');
}


const systemFiles = ['favicon.ico'];
server.on('request', (req, res) => {

  const pathname = url.parse(req.url).pathname.slice(1);
  const isDirectlyPath = pathname.split('/').length === 1;
  const filepath = path.join(__dirname, 'files', pathname);
  const isSystemFiles = systemFiles.every(_ => _ === pathname[0]);

  if (isSystemFiles) {
    res.statusCode = 200;
    res.end();
  }

  if (!isDirectlyPath) {
    res.statusCode = 400;
    res.end('Path not exists');
  }


  switch (req.method) {
    case 'GET':
      fs.exists(filepath, (exists) => {

        if (!exists) {
          return set404(res);
        }

        const stream = fs.createReadStream(filepath);
        pipeline(stream, res, (err) => set500(res));


      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

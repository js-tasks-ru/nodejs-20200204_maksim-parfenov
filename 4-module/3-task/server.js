const url = require('url');
const http = require('http');
const path = require('path');
const { existsSync, unlinkSync } = require('fs');

const server = new http.Server();
const set500 = (res) => {
  res.statusCode = 500;
  return res.end('Server error');
}
const set413 = (res) => {
  res.statusCode = 413;
  return res.end('Server error 413');
}

const systemFiles = ['favicon.ico'];
const LIMIT_SIZE = 2 ** 20;
server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isFilePath = pathname.split('/').length === 1;
  const isSystemFiles = systemFiles.every(_ => _ === pathname[0]);
  const isExists = existsSync(filepath);

  if (!isFilePath) {
    res.statusCode = 400;
    return res.end('Path not exists');
  }
  
  if (!isExists) {
    res.statusCode = 404;
    return res.end('File with same name already exists');
  }

  if (isSystemFiles) {
    res.statusCode = 200;
    return res.end();
  }

  


  switch (req.method) {
    case 'DELETE':
      if(existsSync(filepath)){
        unlinkSync(filepath);
      }
      res.statusCode = 200;
      res.end();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

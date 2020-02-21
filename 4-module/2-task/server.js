const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream.js')
const { createWriteStream, exists, existsSync, unlinkSync } = require('fs');
const server = new http.Server();
const limitStream = new LimitSizeStream({ limit: 2 ** 20 });
const { promisify } = require('util');
const { pipeline, finished } = require('stream')


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

  if (isExists) {
    res.statusCode = 409;
    return res.end('File with same name already exists');
  }

  if (isSystemFiles) {
    res.statusCode = 200;
    return res.end();
  }

  if (!isFilePath) {
    res.statusCode = 400;
    return res.end('Path not exists');
  }

  switch (req.method) {
    case 'POST':
      const Wstream = createWriteStream(filepath);
      res.on('close', () => {
        hasError = true;
        Wstream.destroy(); // удаляем файл
       
      });
      let body = '';
      let hasError = false;
      req
        .on('readable', () => {
          body += req.read();

          if (body.length > LIMIT_SIZE) {
            hasError = true;
            if(existsSync(filepath)){
              unlinkSync(filepath);
            }
            res.statusCode = 413;
            res.end('Size');
          }
          req.pipe(Wstream);

        })
        .on('error', (err) => {
          res.statusCode = 500;
          res.end('Server Error');
        })
        .on('end', () => {
          if(hasError){
            if(existsSync(filepath)){
              unlinkSync(filepath);
            } 
          }
          hasError = false;
          res.statusCode = 201;
          res.end('Success');
        });
        Wstream.on('close', () => {
          if(hasError) {
            if(existsSync(filepath)){
              unlinkSync(filepath);
            }
          }
        });

        Wstream.on('error', () => {
          if(existsSync(filepath)){
            unlinkSync(filepath);
          }
          res.statusCode = 500;
          res.end('Error');
        })
      return;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }


  
  // оборвали соединение
 
});

module.exports = server;


/*


  const writeStream = createWriteStream(filepath);

  switch (req.method) {
    case 'POST':
      pipeline(req, limitStream, writeStream, (err) => {
        if (err) {
          if (err.name === 'LimitExceededError') {
            console.log("DELETE FILE LimitExceededError")
            // req.unpipe();
            const result = existsSync(filepath)
            if (result) {
              console.log([typeof unlinkSync(filepath)]);
            }
            console.log(filepath, existsSync(filepath));
            res.statusCode = 413;
            return res.end('Server error 413');
          } else {
            res.statusCode = 500;
            return res.end('Server error');
          }
        } else {
          res.statusCode = 201;
          return res.end('Success');
        }
      });
      return;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
      console.log("DELETE FILE end")
      // req.unpipe();
      unlinkSync(filepath);
      console.log('ОБОРВАЛ!');
    }
  })

  // req.on('end', () => {
  //   console.log("DELETE FILE end")
  //   req.unpipe();
  //   unlink(filepath, () => true);
  //   console.log('ОБОРВАЛ!');
  // });

*/


/*


 const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isDirectlyPath = pathname.split('/').length === 1;

  // const isExists = await (promisify(exists))(filepath);
  const isExists = existsSync(filepath);

  if (isExists) {
    res.statusCode = 409;
    return res.end('File with same name already exists');
  }


  const isSystemFiles = systemFiles.every(_ => _ === pathname[0]);
  // console.dir({
  //   filepath,
  //   pathname
  // });
  if (isSystemFiles) {
    res.statusCode = 200;
    return res.end();
  }

  if (!isDirectlyPath) {
    res.statusCode = 400;
    return res.end('Path not exists');
  }

  const writeStream = createWriteStream(filepath);

  writeStream.once('error', (error) => {
    unlink(filepath, () => true);
  });

  limitStream.once('error', (error) => {
    writeStream.end();
    res.statusCode = 413;
    res.end('Server error 413');
  });


  switch (req.method) {
    case 'POST':
      pipeline(
        req,
        limitStream,
        writeStream,
        (err) => {
          console.log(err, "SUCESS");
         if( err ) {
          return set500(res);
         }
         res.statusCode = 201;
         res.end('Success');
        }
      );
      return;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.once('aborted', () => {
    unlink(filepath, () => true);
  });

*/
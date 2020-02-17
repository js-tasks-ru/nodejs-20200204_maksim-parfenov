const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._chunkBuffer = '';
  }

  _transform(chunk, encoding, callback) {
    this._chunkBuffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    const arr = this._chunkBuffer.split(os.EOL);
    while (arr.length) {
      this.push(arr.shift());
    }
    this._chunkBuffer = '';
    callback();
  }
}


module.exports = LineSplitStream;

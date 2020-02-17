const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._limit = options.limit || null;
    this._send = 0;
  }

  _transform(chunk, encoding, callback) {
    const size = chunk.toString().length;
    this._send += size;
    const hasError = this._send > this._limit;
    
    if (hasError) {
      return callback(new LimitExceededError);
    }

    return callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

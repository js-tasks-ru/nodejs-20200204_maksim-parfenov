const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const user = Session.findOne({token}).populate('user');

    if (!user) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async ({from, message}) => {
      await Message.create({
        date: new Date(),
        text: message,
        chat: socket.user.id,
        user: socket.user.displayName,
      });
      // socket.broadcast.emit('message', {from, message});
    });
  });

  return io;
}

module.exports = socket;

const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  try {
    const mess = await Message.find({user: ctx.user.displayName}).limit(20);
    const messages = mess.map((item) => ({
      date: item.date, // дата сообщения
      text: item.text, // текст сообщения
      id: item.id, // идентификатор сообщения
      user: item.user, // Имя (displayName) пользователя, отправившего это сообщение
    }));
    ctx.body = {messages};
  } catch (err) {
    ctx.body = {error: err};
  }
};

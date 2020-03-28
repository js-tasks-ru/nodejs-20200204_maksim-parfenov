const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');


module.exports.register = async (ctx, next) => {
  const token = uuid();

  const newUserData = {
    verificationToken: token,
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
  };

  try {
    const newUser = await User.create(newUserData);
    await newUser.setPassword(ctx.request.body.password);
    await newUser.save();
    await sendMail({
      template: 'confirmation',
      locals: {token: newUser.verificationToken},
      to: newUser.email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
    return next();
  } catch (err) {
    ctx.status = 400;
    if (err.errors.displayName) ctx.body = {errors: {displayName: err.errors.displayName.message}};
    if (err.errors.email) ctx.body = {errors: {email: err.errors.email.message}};
  }
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOneAndUpdate(
    {verificationToken: ctx.request.body.verificationToken},
    {$unset: {verificationToken: undefined}}
  );
  if (user === null) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return next();
  }
  ctx.body = {token: uuid()};
};

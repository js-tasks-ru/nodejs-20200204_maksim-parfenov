const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  // authenticate('github', get(profile, 'emails[0].value'), profile.username, done);
  // email, displayName - required
  try {
    if (!email) return done(null, false, 'Не указан email');

    let user = await User.findOne({email});

    if (user === null) {
      const newUser = new User({email, displayName});
      user = await newUser.save();
    }

    return done(null, user);
  } catch (err) {
    done(err);
  }
};

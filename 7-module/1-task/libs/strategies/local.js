const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');


module.exports = new LocalStrategy(
  {usernameField: 'email', session: false},
  async function(email, password, done) {
    try {
      const user = await User.login(email, password);

      if (user) {
        return done(null, user);
      }

      // ошибка

    } catch (e) {
      return done(null, false, e.message);
    }


    // done(null, false, 'Стратегия подключена, но еще не настроена');
  },
);

import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';

export default function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user === undefined) {
      return done(null, false, { message: 'Invalid login.' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      }
      return done(null, false, { message: 'Invalid login.' });
    } catch (error) {
      return done(error);
    }
  };
  passport.use(new passportLocal.Strategy({ usernameField: 'email' }, authenticateUser));
  // eslint-disable-next-line
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

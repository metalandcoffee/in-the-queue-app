import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'

export default function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);

        if (user == undefined) {
            return done(null, false, { message: 'Invalid login.' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid login.' });
            }
        } catch {
            return done(error);
        }

    };
    passport.use(new passportLocal.Strategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

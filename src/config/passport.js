import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/user.model.js";

const cookieExtractor = req => {

    let token = null;

    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    
    return token;
};

const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: `secretocoder`
}

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {

    try {
        const user = await userModel.findById(jwt_payload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (err) {
        return done(err, false);
    }
}));

export default passport
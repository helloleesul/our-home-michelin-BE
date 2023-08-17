import { Strategy as ExtractJwt, JwtStrategy } from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config();

const extractJwtFromCookie = req => {
    return req.cookies.token
};

const options = {
    secretOrKey: process.env.JWT_SECRET, 
    //다른방식으로도 가능한 틀.
    //ex)ExtractJwt.fromAuthHeaderAsBearerToken()
    jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie,
    ]),
};

export default new JwtStrategy(options, async (jwtPayload, done) => {
    try{
        done(null, jwtPayload);
    } catch(error) {
        done(error, false);
    }
});
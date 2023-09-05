import pkg from "passport-jwt";
import dotenv from "dotenv";

dotenv.config();

const { Strategy: JwtStrategy, ExtractJwt } = pkg;

const extractJwtFromCookie = (req) => {
  return req.signedCookies.t;
};

const options = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
};

export default new JwtStrategy(options, async (jwtPayload, done) => {
  try {
    done(null, jwtPayload);
  } catch (error) {
    done(error, false);
  }
});

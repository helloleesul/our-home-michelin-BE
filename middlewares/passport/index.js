import passport from "passport";
import local from "./local.js";
import jwt from "./jwt.js";

export default () => {
  passport.use(local);
  passport.use(jwt);
};

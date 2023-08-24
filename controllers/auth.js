import User from "../models/user.js";
import hashPassword from "../middlewares/hashpassword.js";
import generateToken from "../middlewares/token.js";
import passport from "passport";

export const login = (req, res, next) => {
    try {
        console.log(req.user);
        const token = generateToken(req.user);
        res.cookie("t", token, {
            httpOnly: true,
            signed: true,
        }).send({ message: "로그인 성공" });
    } catch (err) {
        err.status = 500;
        next(err);
    }
};

export const join = async (req, res, next) => {
    try {
        const { email, nickName, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("이미 존재하는 email입니다.");
            error.status = 400;
            throw error;
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            email,
            nickName,
            password: hashedPassword,
        });

        res.json({ message: "회원가입이 성공적으로 완료되었습니다." });
    } catch (error) {
        next(error);
    }
};

export const checkLogin = (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.json({ isAuthenticated: false });
        return res.json({ isAuthenticated: true, user });
    })(req, res);
};

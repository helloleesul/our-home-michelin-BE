import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const userVerificationStatus = new Map();

const userVerificationCodes = new Map();

export const sendVerificationCode = async (req, res, next) => {
    const { email } = req.body;

    const verificationCode = crypto.randomBytes(4).toString("hex");
    const expiryTime = Date.now() + 3 * 60 * 1000;
    userVerificationCodes.set(email, { code: verificationCode, expiryTime: expiryTime, attempts: 0 });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "안녕하세요 5스타 회원가입 인증번호 입니다.",
        text: `당신의 인증번호는 ${verificationCode} 입니다.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send("인증 코드를 보냈습니다!");
    } catch (error) {
        next(new Error("인증 코드 전송 중 오류가 발생했습니다."));
    }
};

export const verifyCode = (req, res, next) => {
    const { email, code } = req.body;

    const storedData = userVerificationCodes.get(email);

    if (!storedData) {
        const error = new Error("유효하지 않은 코드입니다.");
        error.status = 400;
        return next(error);
    }

    storedData.attempts += 1;

    if (storedData.attempts > 3) {
        userVerificationCodes.delete(email);
        const error = new Error("최대 시도 횟수를 초과했습니다.");
        error.status = 400;
        return next(error);
    }

    if (storedData.expiryTime < Date.now()) {
        userVerificationCodes.delete(email);
        const error = new Error("인증코드가 만료되었습니다.");
        error.status = 400;
        return next(error);
    }

    if (storedData.code === code) {
        userVerificationCodes.delete(email);

        userVerificationStatus.set(email, true);

        next();
    } else {
        const error = new Error("유효하지 않은 코드입니다.");
        error.status = 400;
        next(error);
    }
};

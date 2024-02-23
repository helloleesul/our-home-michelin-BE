import nodemailer from "nodemailer";
import crypto from "crypto";
import VerificationCode from "../models/VerificationCode.js";

const transporter = nodemailer.createTransport({
  service: "naver",
  host: "smtp.naver.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationCode = async (req, res, next) => {
  const { email } = req.body;
  const verificationCode = crypto.randomBytes(4).toString("hex");
  const expiryTime = Date.now() + 3 * 60 * 1000;

  try {
    await VerificationCode.findOneAndUpdate(
      { email },
      {
        $set: {
          code: verificationCode,
          expiryTime,
          attempts: 0,
        },
      },
      { upsert: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "안녕하세요 우리집 냉슐랭 회원가입 인증번호입니다.",
      text: `당신의 인증번호는 ${verificationCode} 입니다.`,
    };

    await transporter.sendMail(mailOptions);
    res.send("인증 코드를 보냈습니다!");
  } catch (error) {
    console.error("Mailer error:", error);
    next(new Error("인증 코드 전송 중 오류가 발생했습니다."));
  }
};

export const verifyCode = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    const storedData = await VerificationCode.findOne({ email });

    if (!storedData) {
      const error = new Error("유효하지 않은 코드입니다.");
      error.status = 400;
      return next(error);
    }

    if (storedData.expiryTime < Date.now()) {
      const error = new Error("인증코드가 만료되었습니다.");
      error.status = 400;
      return next(error);
    }

    if (storedData.code === code) {
      res.status(200).json({ message: "인증 성공!" });
    } else {
      const error = new Error("유효하지 않은 코드입니다.");
      error.status = 400;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

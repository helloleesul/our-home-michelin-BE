import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const userVerificationCodes = new Map();

export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  const verificationCode = crypto.randomBytes(4).toString("hex");
  userVerificationCodes.set(email, verificationCode);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("인증 코드를 보냈습니다!");
  } catch (error) {
    res.status(500).send("Failed to send verification code.");
  }
};

export const verifyCode = (req, res) => {
  const { email, code } = req.body;

  const storedCode = userVerificationCodes.get(email);
  if (storedCode === code) {
    userVerificationCodes.delete(email);
    res.send("인증되었습니다!");
  } else {
    res.status(400).send("유효하지않은 코드입니다.");
  }
};

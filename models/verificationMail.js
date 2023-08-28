import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
    expires: "3m",
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

const VerificationCode = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema
);

export default VerificationCode;

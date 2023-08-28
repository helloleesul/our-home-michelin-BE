import multer from "multer";
import uuid4 from "uuid4";
import path from "path";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "img");
    },
    filename(req, file, done) {
      const imgID = uuid4();
      const ext = path.extname(file.originalname);
      const imgFileName = imgID + ext;
      done(null, imgFileName);
    },
  }),
  limits: { fileSize: 1024 * 1024 }, // DoS 공격 보호를 위해 설정하는 것이 좋다고 하여 작성
  fileFilter: fileFilter,
});

export default upload;

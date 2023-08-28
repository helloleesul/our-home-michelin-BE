function verifyCookie(req, res, next) {
  const tokenFromCookie = req.signedCookies["t"];

  if (!tokenFromCookie) {
    return res.status(401).send("쿠키가 없거나 수정되었습니다.");
  } else {
    next();
  }
}

export default verifyCookie;

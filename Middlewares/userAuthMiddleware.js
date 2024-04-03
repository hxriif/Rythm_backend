const jwt = require("jsonwebtoken");

module.exports = verifyToken = (req, res,next) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(403).json({ error: "token is not provided" });
  }
  jwt.verify(token, process.env.USER_ACCES_TOKEN_SECRET, (err, decode) => {
    if (err) {
      res.status(401).json({ error: "unautharized" });
    }
    req.email = decode.email;
    next();
  });
};
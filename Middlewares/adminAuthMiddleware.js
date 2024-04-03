const jwt = require("jsonwebtoken")


module.exports = function verifyToken(req, res, next) {
  const token = req.headers["authorization"];


  if (!token) {
    res.status(403).json({ error: "invalid token format" });
  }
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "unautharized" });
    }
    req.email = decoded.email;
    next();
  });
};
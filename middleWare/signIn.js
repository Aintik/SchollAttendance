const jwt = require("jsonwebtoken");

function tokening(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, (process.env.tokenKey || "privateKey"), (err, data) => {
      if (err) throw err;
      req.user = data;
      next();
    });
  } else res.json({ message: "U r not logged" });
}

module.exports = tokening;

const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "James",
      };
      const secret = process.env.ACCESS_TOKEN;
      const options = {
        expiresIn: "15s",
        issuer: "James",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) console.log("Dont have token");
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) console.log("not authorize");
      req.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        name: "James",
      };
      const secret = process.env.REFRESH_TOKEN;
      const options = {
        expiresIn: "1y",
        issuer: "James",
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, payload) => {
        if (err) reject(err.message);
        const userId = payload.aud;
        resolve(userId);
      });
    });
  },
};

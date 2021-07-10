const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();



exports.AdminRequiredLogin = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    res.send({ status: 401, message: "Login first" });
  }
  else {
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
      if (err) {
        res.send({ status: 401, message: "Login first" });
      }
      else {
        if (decoded.tin === "admin") next();
        else {
          res.send({ status: 401, message: "Must be admin" });
        }
      }
    });
  }



};
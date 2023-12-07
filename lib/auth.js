require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = checkToken = async (req, res, next) => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjU1NWQ0MGYzNWIzNTYxNTdkMDJiZjIzIiwibmFtZSI6Im51azIxIiwibGV2ZWwiOiIxIiwiaWF0IjoxNzAxMDUxMjE3LCJleHAiOjMxNzI0NTQ5MzYxN30.ll762P6DmQej0DxFlVMC8PkZXJykmDv8xEabCVY5GaI";
  // let token = req.rawHeaders["auth-token"];
  // console.log("token >>>> ",req.body.token)
  // let token = req.body.token;
  // console.log("this is a Token!! > ",token)
  if (token!==undefined) {
    token = token.replace(/^Bearer\s+/, "");
    // console.log(token)
    jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
      if (err) {
        return res.status(408).json({
          success: false,
          message: "หมดเวลาใช้งานแล้ว",
          logout: true,
          description: "Request Timeout",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Token not provided Token ไม่ถูกต้อง", token,
      logout: false,
      description: "Unauthorized",
    });
  }
};

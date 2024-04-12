var jwt = require("jsonwebtoken");
var Admin = require("../models/antiques/antiques_admin.model");
var bcrypt = require("bcrypt");

const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.Login = async (req, res) => {
  try {
    // const username = "nuk21"
    const user = await Admin.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(403).send({message: "User not found"});
    }
    const bcrypt_password = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!bcrypt_password) {
      return res.status(403).send({message: "Invalid password"});
    }
    // const username = req.body.username;

    const secretKey = "SECRET_KEY";
    const payload = {
      user_id: user._id,
      name: user.username,
      level: user.level,
    };
    const token = jwt.sign(payload, secretKey, {expiresIn: "9999 years"});
    console.log("bcrypt_password");
    console.log("admin : ", token);
    console.log("Payload", payload);
    // console.log("token", token)

    return res
      .status(200)
      .send({message: "เข้าสู่ระบบสำเร็จ", token: token, data: user});
  } catch (error) {
    return res
      .status(500)
      .send({message: "Internal Server Error", error: error.message});
  }
};

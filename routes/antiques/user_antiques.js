const router = require("express").Router();
const Register = require("../../controllers/antiques_user.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

router.get("/createuser", auth, Register.CreateUser);

module.exports = router;
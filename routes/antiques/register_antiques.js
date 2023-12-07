const router = require("express").Router();
const Register = require("../../controllers/antiques_register.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.post("/register", auth, Register.CreateRegister);

module.exports = router;
const router = require("express").Router();
const Login = require("../../controllers/login.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

router.post("/", Login.Login);

module.exports = router;
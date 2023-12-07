const router = require("express").Router();
const TestCamera = require("../../controllers/testcamera.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.get("/testcamera", auth, TestCamera.TestCamera);
// router.get("/testcamera", auth, TestCamera.TestCamera2);

module.exports = router;
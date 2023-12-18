const router = require("express").Router();
const Camera = require("../../controllers/camera.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.post("/takecamera", auth, Camera.Camera);
// router.get("/testcamera", auth, TestCamera.TestCamera2);

module.exports = router;
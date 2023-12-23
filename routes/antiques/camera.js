const router = require("express").Router();
const Camera = require("../../controllers/camera.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.post("/takecamera", auth, Camera.Camera);
router.post("/chkcamera", Camera.ChkCamera);
router.post("/getimagefromdrive", Camera.GetImageFromDrive);
// router.get("/testcamera", auth, TestCamera.TestCamera2);

function testFunction(){
    console.log("This Test Function")
}

module.exports = router;
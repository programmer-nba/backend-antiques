const router = require("express").Router();
const admin = require("../../controllers/user.controller/admin.controller");
const employee = require("../../controllers/user.controller/employee.controller")
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");

// admin
router.post("/admin", auth, admin.create);
router.get("/admin", auth, admin.findAll);
router.get("/admin/:id", auth, admin.findOne);
router.put("/admin/:id", auth, admin.update);
router.delete("/admin/:id", auth, admin.delete);

// employee
router.post("/employee", auth, employee.create);
router.get("/employee", auth, employee.findAll);
router.get("/employee/:id", auth, employee.findById);
router.put("/employee/:id", auth, employee.update);
router.delete("/employee/:id", auth, employee.delete);

module.exports = router;
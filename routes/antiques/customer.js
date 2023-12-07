const router = require("express").Router();
const Customer = require("../../controllers/customer.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.get("/getCus", auth, Customer.getCustomer);
router.post("/createCus", auth, Customer.createCustomer);
router.post("/filterCusByData", auth, Customer.filterCusByData)
router.put("/editCustomer", auth, Customer.UpdateCustomer)
router.post("/testCreateImage", auth, Customer.testCreateImage)

// DROP DOWN 

router.get("/dropdownCus_id", auth, Customer.DropdownCusID)
router.get("/dropdownCus_name", auth, Customer.DropdownCusName)
router.get("/dropdownCus_vehicle", auth, Customer.DropdownCusVehicle)


module.exports = router;

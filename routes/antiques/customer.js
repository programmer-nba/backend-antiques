const router = require("express").Router();
const Customer = require("../../controllers/customer.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");


router.post("/", auth, Customer.createCustomer);
router.get("/", auth, Customer.getCustomer);
router.get("/bytel/:tel", auth, Customer.getCusByPhone);
router.put("/:id", auth, Customer.UpdateCustomer)
router.delete("/:id", auth, Customer.DeleteCustomer);

// DROP DOWN 
router.get("/dropdownCus_id", auth, Customer.DropdownCusID)
router.get("/dropdownCus_name", auth, Customer.DropdownCusName)
router.get("/dropdownCus_vehicle", auth, Customer.DropdownCusVehicle)


module.exports = router;

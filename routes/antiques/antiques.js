const router = require("express").Router();
const Category = require("../../controllers/antiques_categories.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.get("/get", auth, Category.Getcategory);
router.get("/getType", Category.GetType);
router.put("/updateType", Category.UpdateType)
router.post("/getcatebyid", Category.GetCateByID)
router.post("/gettypebyid", Category.GetTypeByID)
router.post("/getdetailbyid", Category.getDetailByID)
router.post("/getvendorbyid", Category.getVendorByID)
router.post("/CreateCategory", auth, Category.CreateCategory);
// router.post("/CreateCategoryType", auth, Category.CreateCategoryType);
// router.post("/createcategory", auth, Category.CreateCategory);
router.post("/createtype", auth, Category.CreateType);
router.post("/createdetailproduct", auth,Category.CreateDetailProduct)
router.post("/createvendorproduct", auth,Category.CreateVendor)
router.put("/update", auth,Category.UpdateCate)
router.put("/delete", auth, Category.CateDelete);
router.get("/getbyid", auth, Category.GetbyId);
router.post("/getOrderData", auth, Category.getOrderData);
router.post("/getdetailvendor", auth, Category.getDetailVendor);
router.put("/deletetypedata", auth, Category.deleteType)
router.put("/deletedetail", auth, Category.DeleteDetail)
router.put("/updatedetail", auth, Category.UpdateDetail)
router.put("/updatevendor", auth, Category.UpdateVendor)


// Check Data 

router.get("/checkdata", auth, Category.CheckData);
module.exports = router;

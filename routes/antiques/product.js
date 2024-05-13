const router = require("express").Router();
const category = require("../../controllers/antiques/product/category.controller");
const type = require("../../controllers/antiques/product/type.controller");
const detail = require("../../controllers/antiques/product/detail.controller")
const price = require("../../controllers/antiques/product/price.controller")
const auth = require("../../lib/auth");

// Category
router.post("/category", auth, category.create)
router.get("/category", auth, category.getCategoryAll)
router.get("/category/:id", auth, category.getCategoryById)
router.put("/category/:id", auth, category.updateCategory)
router.delete("/category/:id", auth, category.deleteCategory)

// Type
router.post("/type", auth, type.create)
router.get("/type", auth, type.getTypeAll)
router.get("/type/:id", auth, type.getTypeById)
router.put("/type/:id", auth, type.updateType)
router.delete("/type/:id", auth, type.deleteType)

// Detail
router.post("/detail", auth, detail.create)
router.get("/detail", auth, detail.getDetailAll)
router.get("/detail/:id", auth, detail.getDetailById)
router.put("/detail/:id", auth, detail.updateDetail)
router.delete("/detail/:id", auth, detail.deleteDetail)

// Price
router.post("/price", auth, price.create)
router.get("/price", auth, price.getPriceAll)
router.get("/price/:id", auth, price.getPriceById)
router.put("/price/:id", auth, price.updatePrice)
router.delete("/price/:id", auth, price.deletePrice)

module.exports = router;
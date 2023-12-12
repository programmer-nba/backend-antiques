const router = require("express").Router();
const Order = require("../../controllers/order.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");



router.get("/getOrder", auth, Order.getOrder);
router.post("/createOrder", auth, Order.CreateDataOrder);
router.get("/getfinishtoday", auth,Order.GetFinishToday)
router.get("/getdatatoday", auth, Order.GetDataToday)
router.post("/getqueuetoday", auth, Order.GetQueueToday)
router.get("/getlastqueue", auth, Order.getlastQueueToday)
router.post("/getorderbydateandqueue", auth, Order.getOrderByDateAndQueue)
router.post("/approveorder", auth, Order.ApproveOrder)
router.post("/saveafterfinish", auth, Order.saveAfterFinish)
router.post("/generatereceiptnumber", auth, Order.GenOrderNumber)
// router.post("/sendtofinish", auth, Order.SendToFinish)
module.exports = router;

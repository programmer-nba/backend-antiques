const router = require("express").Router();
const Report = require("../../controllers/report.controller");
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/auth.admin");


// ---------------------- Receipt -----------------------//
router.post("/receiptorder", auth, Report.ReceiptOrder); // ใบเสร็จรับเงิน
router.get("/receiptcashbill", auth, Report.ReceiptCashBill); // ใบเสร็จเงินสด

//----------------------- Roport -------------------------//
router.post("/purchasesummary", auth, Report.PurchaseSummary) // รายงานสรุปการซื้อตามรายการสินค้า
router.post("/ordersummaryreportbydate", auth, Report.OrderSummaryReportByDate) //รายงานการซื้อประจำวัน/ตามเลขที่
module.exports = router;
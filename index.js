//Production
// const path = require("path");
// require("dotenv").config({path:__dirname +  "/.env"});

//Dev
require("dotenv").config();

const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(bodyParser.json({limit: "50mb", type: "application/json"}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(cors());
//--------------------------------------- ANTIQUES---------------------------------------//
var CategoryRouter = require("./routes/antiques/antiques.js");
var RegisterAntiquesRouter = require("./routes/antiques/register_antiques.js");
var UserAntiques = require("./routes/antiques/user_antiques.js");
var loginAntiques = require("./routes/antiques/login.js");
var Customer = require("./routes/antiques/customer.js");
var Order = require("./routes/antiques/order.js");
var TestCamera = require("./routes/antiques/testcamera.js");

// Antiques
app.use("/v1/antiques/", CategoryRouter);
// REGISTER ANTIQUES
app.use("/v1/antiques", RegisterAntiquesRouter);
// Create USER
app.use("/v1/antiques/user/", UserAntiques);
// Login
app.use("/v1/antiques/", loginAntiques);
// Customer
app.use("/v1/antiques/customer/", Customer);
// Order data
app.use("/v1/antiques/order/", Order);
// TEST CAMERA
app.use("/v1/camera/", TestCamera);
// Report
app.use("/v1/report/", require("./routes/antiques/report.js"));

//--------------------------------------------------------------------------------------//

// Delete Image
app.use("/v1/delete/image", require("./routes/pos/deleteImage"));
// CALL ME
app.use("/v1/me", require("./routes/pos/me"));
// UPLOAD FILE COLLECTION
app.use("/v1/image/collection", require("./routes/pos/uploadfile.collection"));
// Line Notify
app.use("/v1/line-notify", require("./routes/pos/line.notify"));
// LOGIN
app.use("/v1/login", require("./routes/pos/login"));
app.use("/v1/login-company", require("./routes/pos/login.company"));

app.use("/v1/admin", require("./routes/pos/admin"));
// Check
app.use("/v1/check", require("./routes/pos/check"));

app.use("/v1/employee", require("./routes/pos/employee"));
app.use("/v1/partner", require("./routes/pos/partner"));
app.use("/v1/shop", require("./routes/pos/shop"));
app.use("/v1/company", require("./routes/pos/company"));

app.use("/v1/product/nba", require("./routes/pos/product.nba"));
app.use("/v1/product/shop", require("./routes/pos/product.shop"));

app.use("/v1/preorder/nba", require("./routes/pos/preorder.nba"));
app.use("/v1/preorder/shop", require("./routes/pos/preorder.shop"));
app.use(
  "/v1/preorder/consignment",
  require("./routes/pos/preorder.consignment")
);
app.use("/v1/preorder/dealer", require("./routes/dealer/podealer"));
app.use("/v1/preorder/shop-full", require("./routes/pos/preorder.shop.full"));

app.use("/v1/invoice/shop", require("./routes/pos/invoice.shop"));
app.use("/v1/invoice-tax", require("./routes/pos/invoice.tax"));

app.use("/v1/return/product", require("./routes/pos/return.product"));
// Types
app.use("/v1/type", require("./routes/pos/type"));
app.use("/v1/dealer", require("./routes/pos/dealer"));

app.use("/v1/product/request", require("./routes/pos/product.request"));

app.use("/v1/product/reference", require("./routes/pos/product.reference"));
app.use("/v1/brand", require("./routes/pos/brand"));

app.use("/v1/percent-profit", require("./routes/pos/percent.profit"));

app.use("/v1/advertising-image", require("./routes/pos/advertising.image"));

//art work
app.use("/v1/artwork", require("./routes/artwork/index"));

//order
app.use("/v1/order", require("./routes/pos/order"));
app.use("/v1/order_consignment", require("./routes/pos/order.consignment"));
app.use("/v1/product/store", require("./routes/pos/product.store"));

//express ระบบ ขนส่ง
app.use("/v1/express/product", require("./routes/express/product.express"));
app.use("/v1/express", require("./routes/express/booking.shippop"));
app.use("/v1/express/order", require("./routes/express/order.express"));
app.use(
  "/v1/express/percent_courier",
  require("./routes/express/percent.courier")
);
app.use("/v1/express/box_standard", require("./routes/express/box.standard"));
app.use("/v1/express/address_book/", require("./routes/express/address.book"));

//counter service
app.use("/v1/counter_service/", require("./routes/cs/"));
app.use("/v1/counter_service/percent", require("./routes/cs/percent"));
app.use("/v1/counter_service/service", require("./routes/cs/service"));
app.use("/v1/counter_service/barcode", require("./routes/cs/barcode"));
app.use(
  "/v1/counter_service/mobile_bill",
  require("./routes/cs/mobile_bill.js")
);
app.use("/v1/counter_service/wallet", require("./routes/cs/wallet"));
app.use("/v1/counter_service/nba", require("./routes/cs/nba"));

//เติมเงินมือถือ
app.use(
  "/v1/counter_service/mobile_topup",
  require("./routes/mobile_topup/index")
);
app.use(
  "/v1/counter_service/card_topup",
  require("./routes/mobile_topup/card.topup")
);
app.use("/v1/mobile_topup", require("./routes/mobile_topup/mobile.topup"));
//More
app.use("/v1/more/money_history", require("./routes/more/money.history"));
app.use("/v1/more/credit_history", require("./routes/more/credit.history"));
app.use("/v1/more/function_more", require("./routes/more/function.more"));
app.use("/v1/more/service_nba", require("./routes/more/service_nba"));
app.use("/v1/more/debit_history", require("./routes/more/debit.history"));
app.use("/v1/more/platform", require("./routes/more/platform"));

//จัดการหมวดหมู่สินค้า
app.use("/v1/category", require("./routes/pos/category"));

//เติมเงินเข้ากระเป๋าอิเล็กทรอนิกส์
app.use("/v1/partner/wallet_topup", require("./routes/topup_wallet/index"));
app.use("/v1/partner/wallet_topup/slip", require("./routes/topup_wallet/slip")); //สลิปโอนเงิน
app.use(
  "/v1/partner/wallet_topup/qrcode",
  require("./routes/topup_wallet/qrcode")
);

app.use("/v1/callback", require("./routes/callback"));

//Thailand
app.use("/v1/thailand", require("./routes/thailand"));

//public
app.use("/v1/public", require("./routes/public"));

const port = process.env.PORT || 9030;
app.listen(port, console.log(`Listening on port ${port}...`));

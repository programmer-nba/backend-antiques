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
app.use("/antiques/", CategoryRouter);
// REGISTER ANTIQUES
app.use("/antiques", RegisterAntiquesRouter);
// Create USER
app.use("/antiques/user/", UserAntiques)
// Login 
app.use("/antiques/", loginAntiques)
// Customer
app.use("/antiques/customer/", Customer)
// Order data 
app.use("/antiques/order/", Order)
// TEST CAMERA
app.use("/antiques/camera/", TestCamera);
// Report 
app.use("/antiques/report/", require('./routes/antiques/report.js'))

const port = process.env.PORT || 9150;
app.listen(port, console.log(`Listening on port ${port}...`));

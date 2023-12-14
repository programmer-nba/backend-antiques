var jwt = require("jsonwebtoken");
var Order = require("../models/antiques/antiques_order.model");
var Category = require("../models/antiques/antiques_category.model");
var Customer = require("../models/antiques/antiques_customers.model");
const bahtText = require('bahttext');
const { google } = require("googleapis");
const fs = require('fs');
const multer = require('multer');
const category_vendor = require("../models/antiques/antiques_categories_vendors.model");
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.getOrder = async (req,res) => {
  try{
      const getAllOrder = await Order.find();
      // console.log(getAllOrder);
      // var chkOrderID = await Order.findOne({}, { sort: { orderId: "-1" } }).select('orderId').limit(1)
      const getOrderId = await Order.findOne().sort({orderId: -1}).limit(1);
      const genOrderId = (getOrderId.orderId)+1
      // var genOrderID = (parseInt(chkOrderID[0].orderId))+1
      // var gentoString = genOrderID.toString();


      // console.log("genOrderId", genOrderId)
      
      return res.status(200).send({message:" Get Order Success ",data: getOrderId})
  }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.CreateDataOrder = async (req,res) => {
  try{
    var items = req.body.items;
    const chk_first_data = await Order.find();
    // if(items.length == 0){
    //   return res.status(401).send({
    //     message: "กรุณาเพิ่มรายการสินค้า",
    //     status: false,
    //   });
    // }
    
    const totalPrice = items.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.total;
    }, 0);
    const totalQty = items.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.qty;
    }, 0);

    if(chk_first_data.length == 0){

      let orderData = {
        orderId: 1,
        customer_id: req.body.customers._id,
        queue: 1,
        customer_class: req.body.customers.class,
        order_detail: req.body.items,
        total: totalPrice,
        total_weight: totalQty,
        createAt: Date.now(), 
        status: " ",
        pay_status: 0,
        warehouse: "WH01",
        unit: "KG"
      }
      const createOrder = new Order(orderData);
      const createOrderData = await createOrder.save();
        return res.status(200).send({message: "Create Order Success"})
    }else{
      var newDate = new Date(req.body.createAt);
      const startOfDay = new Date(newDate.toISOString(req.body.createAt).split('T')[0] + 'T00:00:00.000Z');
      const endOfDay = new Date(newDate.toISOString(req.body.createAt).split('T')[0] + 'T23:59:59.999Z');
      const getOrderNow = await Order.find({
              $and: [
                  { queue: req.body.queue },
                  { createAt:   {$gte: startOfDay,
                                $lte: endOfDay
                                } 
                    }
              ]});

          if(getOrderNow.length != 0){
            var items = req.body.items;
            const updateData = {
              $set: {
                order_detail: req.body.items,
                total: req.body.total,
                status: "FINISH"   
              },
            };

      const getdataOrderId = await Order.findOne({orderId: getOrderNow[0].orderId})
      console.log("getdataOrderId : ", getdataOrderId)
      const result = await Order.findByIdAndUpdate(getdataOrderId._id, updateData, { new: true })

      return res.status(200).send({message: "Update Data Success", data: result})
    }else{
      const getOrderId = await Order.findOne().sort({orderId: -1}).limit(1);
        if(!getOrderId){
          getOrderId = 0
        }
      const genOrderId = (getOrderId.orderId)+1
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');

      var getQueueToday = await Order.findOne({
        createAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).sort({queue: -1}).limit(1);
     
      if(!getQueueToday){
        var newQueue = 1 
      }else{
        var newQueue = getQueueToday.queue+1
      }

      var customer = req.body.customers;
      var item = req.body.items;
      if(customer.length == 0){
          var customer = await Customer.findOne({_id: "6569a9f652f2871ab9e9cead"});
          var customerId = (customer._id).toString();
      }else{
          var customer = req.body.customers
          var customerId = customer._id 
      }

      var getLastOrder = await Order.findOne().sort({orderId: -1}).limit(1);
    
      if(currentDate.getDate() < 10 ){
        var getDay = "0"+currentDate.getDate()
      }else{
        var getDay = currentDate.getDay()
      }
      if(currentDate.getMonth() < 10){
        var getMonth = "0"+(currentDate.getMonth())
      }else{
        var getMonth = currentDate.getMonth()+1
      }
      var Year = currentDate.getFullYear();
      var getYear = Year.toString().slice(2,4)

    
      if(getLastOrder.createAt.getDate() < 10){
        var chkDay = "0"+getLastOrder.createAt.getDate()
      }else{
        var chkDay = getLastOrder.createAt.getDate()
      }
      if(getLastOrder.createAt.getMonth()< 10){
        var chkMount = "0"+getLastOrder.createAt.getMonth()+1
      }else{
        var chkMount = getLastOrder.createAt.getMonth()+1
      }
      var dateInData = getLastOrder.createAt.getFullYear()+"-"+chkMount+"-"+chkDay
      var dateToday = Year+"-"+getMonth+"-"+getDay

      const generateOrderNumber = getLastOrder.trackorder
    
      const convertString = generateOrderNumber.toString()
      const sliceOrderNumber = convertString.slice(8,12)
   
        if(dateInData == dateToday){
          var gentoInt = (parseInt(sliceOrderNumber, 10))+1
        }else{
          var gentoInt = 1
        }
        console.log("gentoInt : ", gentoInt)
        if(gentoInt < 10){
              var genrateNumber = "0"+"0"+"0"+gentoInt.toString()
        }else if (gentoInt < 100){
          var genrateNumber = "0"+"0"+gentoInt.toString()
        }else if (gentoInt < 1000){
          var genrateNumber = "0"+gentoInt.toString()
        }else if (gentoInt < 1000){
          var genrateNumber = gentoInt.toString()
        }
      const tracknumber = "OD"+getDay+getMonth+getYear+genrateNumber

      var getWarehouse = req.body.wherehouse // wherehouse
        let orderData = {
          orderId: genOrderId,
          customer_id: customerId,
          queue: newQueue,
          customer_class: req.body.customers ? req.body.customers.class : customer.class,
          order_detail: req.body.items,
          total: totalPrice,
          total_weight: totalQty,
          createAt: Date.now(), 
          status: "FINISH",
          pay_status: 0,
          warehouse: "WH01",
          unit: "KG",
          trackorder: tracknumber
        }
        console.log("orderData : ", orderData)
        const createOrder = new Order(orderData);
        const createOrderData = await createOrder.save();
        
        return res.status(200).send({message: "Create Data Success", data: orderData})
      }
    }
    
   
      }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
      }
}

module.exports.GetFinishToday = async (req,res) => {
  try{
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    var getOrderFinishToday = await Order.find({
        createAt: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: "FINISH"
      });
    return res.status(200).send({message: "Get Data Finish Today Successfully",data: getOrderFinishToday})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.GetDataToday = async (req,res) => {
  try{
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    var getOrderToday = await Order.find({
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    return res.status(200).send({message: "Get today Success",data: getOrderToday })
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});

  }
}

module.exports.GetQueueToday = async (req,res) => {
  try{
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    var getQueueToday = await Order.find({
      queue: req.body.queue,
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    if (getQueueToday.length == 0)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "ไม่รบคิวรายการนี้ในระบบ",
      status: false,
    });

    return res.status(200).send({message: "Get Queue Success",data: getQueueToday })
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.getlastQueueToday = async (req,res) => {
  try{
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    var getQueueToday = await Order.findOne({
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({queue: -1}).limit(1);
    if(!getQueueToday){
      var newQueue = 1
    }else{
      var newQueue = getQueueToday.queue+1
    }
    console.log("startOfDay : ", startOfDay)
    console.log("getQueueToday : ", getQueueToday)
    console.log("endOfDay : ", endOfDay)
    
    // console.log("getQueueToday.queue : ", getQueueToday.queue)
    return res.status(200).send({message: "Get Last Queue Today",data: newQueue }) 
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.getOrderByDateAndQueue = async (req,res) => {
  try{
    const getDatetime = req.body.createAt;
    const currentDate = new Date(getDatetime);
    
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    var getQueueToday = await Order.findOne({
      queue: req.body.queue,
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    const newQueue = parseInt(getQueueToday.queue)
    if (!getQueueToday)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "ไม่คิวรายการนี้ในระบบ",
      status: false,
    });
    console.log("getQueueTodayb : ", getQueueToday.customer_id)
    // console.log("QQQQ : ", getQueueToday['_id'])
    // console.log("ID : ", )
    const customer = await Customer.findOne({_id: getQueueToday.customer_id})
    // new Array(getQueueToday)
    
    let dataOrder = [
      getQueueToday,
      customer
    ]
    // console.log(dataOrder)
    return res.status(200).send({message: "Get Last Queue Today",data: dataOrder }) 
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.ApproveOrder = async (req,res) => {
  try{
    const getDatetime = req.body.createAt;
    const currentDate = new Date(getDatetime);
    
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    console.log("startOfDay", startOfDay)
    console.log("endOfDay", endOfDay)
   
    var getQueueToday = await Order.findOne({
      queue: req.body.queue,
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    var getCus = await Customer.findOne({
      _id: getQueueToday.customer_id
    });
    var getOrderID = await Order.findOne({orderId: getQueueToday.orderId});
    console.log("getOrderID : ", getOrderID._id)
    var gentoString = (getCus._id).toString()
    // console.log(gentoString)
    const updateData = {
      $set: {
        order_detail: req.body.items,
        status: "APPROVE",
        customer_id: getCus.id
      },
     
    };



    const result = await Order.findByIdAndUpdate(getOrderID._id, updateData, { new: true })
    return res.status(200).send({message: "Approve Data Success", data: result })
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}
module.exports.saveAfterFinish = async (req,res) => {
  try{
    const getOrderId = await Order.findOne().sort({orderId: -1}).limit(1);
    const genOrderId = (getOrderId.orderId)+1
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    const testStartDay = "2023-11-24T00:00:00.072Z";
    const testEndtDay = "2023-11-24T23:59:59.999Z";
    const chk_queueToday = await Order.find();
    var getOrderDataAll = await Order.find({
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    var getQueueToday = await Order.findOne({
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({queue: -1}).limit(1);
    console.log(getQueueToday)
    if(!getQueueToday){
      var newQueue = 1
    }else{
      var newQueue = getQueueToday.queue+1
    }
      // var genQueueToInt = getQueueToday.queue+1
    

    console.log(getQueueToday)

    
    var customer = req.body.customers;
    var item = req.body.item;
    var getWarehouse = req.body.wherehouse
      let orderData = {
        orderId: genOrderId,
        customer_id: req.body.customers._id,
        queue: newQueue,
        customer_class: req.body.customers.class,
        order_detail: req.body.items,
        total: "",
        total_weight: "",
        createAt: Date.now(), 
        status: " ",
        pay_status: 0,
        warehouse: "WH01",
        unit: "ลัง"
      }
      const createOrder = new Order(orderData);
      const createOrderData = await createOrder.save();
       
      return res.status(200).send({message:" Create Order Success ",data: {orderData, orderData, createOrder}})
  }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.GenOrderNumber = async (req,res) => {
  try{
    var getLastOrder = await Order.findOne().sort({orderId: -1}).limit(1);
    var currentDate = new Date()  

    if(currentDate.getDate() < 10 ){
      var getDay = "0"+currentDate.getDate()
    }else{
      var getDay = currentDate.getDay()
    }
    if(currentDate.getMonth() < 10){
      var getMonth = "0"+(currentDate.getMonth())
    }else{
      var getMonth = currentDate.getMonth()+1
    }
    var Year = currentDate.getFullYear();
    var getYear = (Year).toString().slice(2,4)


    if(getLastOrder.createAt.getDate() < 10){
      var chkDay = "0"+getLastOrder.createAt.getDate()
    }else{
      var chkDay = getLastOrder.createAt.getDate()
    }
    if(getLastOrder.createAt.getMonth()< 10){
      var chkMount = "0"+getLastOrder.createAt.getMonth()+1
    }else{
      var chkMount = getLastOrder.createAt.getMonth()+1
    }
    var dateInData = getLastOrder.createAt.getFullYear()+"-"+chkMount+"-"+chkDay
    var dateToday = Year+"-"+getMonth+"-"+getDay

    const generateOrderNumber = getLastOrder.trackorder
    const convertString = generateOrderNumber.toString()
    const sliceOrderNumber = convertString.slice(6,10)

    if(dateInData == dateToday){
      var gentoInt = (parseInt(sliceOrderNumber, 10))+1
    }else{
      var gentoInt = 1
    }
    if(gentoInt < 10){
          var genrateNumber = "0"+"0"+"0"+gentoInt.toString()
    }else if (gentoInt < 100){
      var genrateNumber = "0"+"0"+gentoInt.toString()
    }else if (gentoInt < 1000){
      var genrateNumber = "0"+gentoInt.toString()
    }else if (gentoInt < 1000){
      var genrateNumber = gentoInt.toString()
    }
    const tracknumber = "OD"+getDay+getMonth+getYear+genrateNumber
    
    function convertToBahtWords(numberString) {
      const bahtWords = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
      const unitWords = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
    
      const numberArray = numberString.split(".");
      const integerPart = numberArray[0];
      const decimalPart = numberArray[1] || "0";
    
      function convertGroup(group) {
        let result = "";
        for (let i = 0; i < group.length; i++) {
          const digit = parseInt(group[i]);
          if (digit !== 0) {
            result += bahtWords[digit] + unitWords[group.length - i - 1];
          }
        }
        return result;
      }
    
      let bahtWordsString = "";
    
      // Convert integer part
      for (let i = 0; i < integerPart.length; i += 6) {
        const group = integerPart.slice(i, i + 6);
        bahtWordsString = convertGroup(group) + bahtWordsString;
      }
    
      // Convert decimal part
      if (decimalPart !== "0") {
        bahtWordsString += "จุด";
        for (let i = 0; i < decimalPart.length; i++) {
          const digit = parseInt(decimalPart[i]);
          bahtWordsString += bahtWords[digit];
        }
      }
    
      return bahtWordsString || "ศูนย์";
    }
    
    const numberString = "515.50";
    const bahtWords = convertToBahtWords(numberString);
    console.log(bahtWords)

    return res.status(200).send({message:" Generate  Order Success ", data: getLastOrder})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}


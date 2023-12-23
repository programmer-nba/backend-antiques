var jwt = require("jsonwebtoken");
var Order = require("../models/antiques/antiques_order.model");
var Category = require("../models/antiques/antiques_category.model");
var Customer = require("../models/antiques/antiques_customers.model");
const bahtText = require('bahttext');
const { google } = require("googleapis");
const fs = require('fs');
const multer = require('multer');
const category_vendor = require("../models/antiques/antiques_categories_vendors.model");
const category_detail = require("../models/antiques/antiques_categories_details.model");
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
                total: totalPrice,
                status: "FINISH"   
              },
            };

      const getdataOrderId = await Order.findOne({orderId: getOrderNow[0].orderId})
      // console.log("getdataOrderId : ", getdataOrderId)
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
      console.log("customers : ", customer)
      console.log("item : ", item)
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
        var getDay = currentDate.getDate()
        // console.log(">>>>>>>>>>>>>>> 10 : GetDay", currentDate.getDate())
      }
      if(currentDate.getMonth() < 10){
        var getMonth = "0"+(currentDate.getMonth())
      }else{
        var getMonth = currentDate.getMonth()+1
      }
      var Year = currentDate.getFullYear();
      var getYear = Year.toString().slice(2,4)

      // console.log("Date: ", getYear,"/",getMonth,"/",getDay)
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
      console.log("dateToday : ", dateToday)
      const generateOrderNumber = getLastOrder.trackorder
    
      const convertString = generateOrderNumber.toString()
      const sliceOrderNumber = convertString.slice(8,12)
   
        if(dateInData == dateToday){
          var gentoInt = (parseInt(sliceOrderNumber, 10))+1
        }else{
          var gentoInt = 1
        }
        // console.log("gentoInt : ", gentoInt)
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
  
    const getCustomerName = await Customer.findOne({_id: "6569a9f652f2871ab9e9cead"});
    let newData = {
      "customer_name": getCustomerName.fullname_th
  } 
    var addDataThis = getOrderFinishToday[0]
  console.log("FIRST : ", getOrderFinishToday[0])
  // addDataThis.push(newData)
  console.log()
     
  const dataOrder = await Order.aggregate([
    {
      $match:{
        status: "FINISH"
      }
    },
    {
      $match:{
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    },
    },
    
    {
      $lookup: {
        from: 'customers',
        let: { orderId: '$customer_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [
                  { $toString: '$_id' }, // Convert _id to string for comparison
                  '$$orderId'
                ]
              }
              
            }
  
          }
         
        ],
        as: 'customerData'
      }
    },
    {
        $unwind: '$customerData'
    },
    {
      $project: {
          _id: '$_id',
          orderId: '$orderId',
          customer_id: '$customer_id',
          customer_name: '$customerData.fullname_th',
          customer_class: '$customerData.class',
          order_detail: '$order_detail',
          total: '$total',
          total_weight: '$total_weight',
          createAt: '$createAt',
          queue: '$queue',
          status: '$status',
          pay_status: '$pay_status',
          warehouse: '$warehouse',
          unit: '$unit',
          trackorder: '$trackorder'

          // all_details: 1
        
      }
    }
    // Additional stages in the aggregation pipeline if needed
  ]);
      console.log("data")
      // getOrderFinishToday["customer_name"] = getCustomerName.fullname_th
      // console.log("getOrderFinishToday : ", getOrderFinishToday.push(addCusNameData))

    return res.status(200).send({message: "Get Data Finish Today Successfully",data: dataOrder})
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
    
    const DateQueueToday = new Date(req.body.createAt); 
    const chkQueueStartOfDay = new Date(DateQueueToday.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const chkQueueEndOfDay = new Date(DateQueueToday.toISOString().split('T')[0] + 'T23:59:59.999Z');
    // console.log("DateQueueToday : ", DateQueueToday);
    var getQueueToday = await Order.find({
      queue: req.body.queue,
      createAt: {
        $gte: chkQueueStartOfDay,
        $lte: chkQueueEndOfDay
      }
    });
    if(getQueueToday.length == 0){
      const getOrderId = await Order.findOne().sort({orderId: -1}).limit(1);
      const genOrderId = (getOrderId.orderId)+1
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
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
      console.log("getQueueToday : ", getQueueToday)
      if(!getQueueToday){
        var newQueue = 1
      }else{
        var newQueue = getQueueToday.queue+1
      }
        // var genQueueToInt = getQueueToday.queue+1
        var getLastOrder = await Order.findOne().sort({orderId: -1}).limit(1);
      
        if(currentDate.getDate() < 10 ){
          var getDay = "0"+currentDate.getDate()
        }else{
          var getDay = currentDate.getDate()
          // console.log(">>>>>>>>>>>>>>> 10 : GetDay", currentDate.getDate())
        }
        if(currentDate.getMonth() < 10){
          var getMonth = "0"+(currentDate.getMonth())
        }else{
          var getMonth = currentDate.getMonth()+1
        }
        var Year = currentDate.getFullYear();
        var getYear = Year.toString().slice(2,4)
  
        // console.log("Date: ", getYear,"/",getMonth,"/",getDay)
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
        console.log("dateToday : ", dateToday)
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
        
  
      
      var customer = req.body.customers;
      var item = req.body.item;
      var getWarehouse = req.body.wherehouse
      if(customer.length == 0){
          
        var customer = await Customer.findOne({_id: "6569a9f652f2871ab9e9cead"});
        var customerId = (customer._id).toString();
    }else{
        var customer = req.body.customers
        var customerId = customer._id 
    }
        var itemData =  req.body.items
        const totalPrice = itemData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.total;
        }, 0);
        const totalQty = itemData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.qty;
        }, 0);
        let orderData = {
          orderId: genOrderId,
          customer_id: customerId,
          queue: newQueue,
          customer_class: req.body.customers.class,
          order_detail: req.body.items,
          total: totalPrice,
          total_weight: totalQty,
          createAt: Date.now(), 
          status: " ",
          pay_status: 0,
          warehouse: "WH01",
          unit: "ลัง",
          trackorder: tracknumber
        }
        console.log("req.body.items : >>>> ", req.body.items)
        const createOrder = new Order(orderData);
        const createOrderData = await createOrder.save();
        return res.status(200).send({message:" Create Order Success ",data: {orderData}})
    }else{
      console.log("have data");
      // console.log("getQueueToday ID : ", getQueueToday[0].trackorder)
        var itemData =  req.body.items
        const totalPrice = itemData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.total;
        }, 0);
        const totalQty = itemData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.qty;
        }, 0);
        console.log("totalPrice : ", totalPrice)
        console.log("totalQty : ", totalQty)
      let orderData = {
        orderId: getQueueToday[0].orderId,
        customer_id: getQueueToday[0].customer_id,
        queue: getQueueToday[0].queue,
        customer_class: getQueueToday[0].class,
        order_detail: req.body.items,
        total: totalPrice,
        total_weight: totalQty,
        createAt: Date.now(), 
        status: " ",
        pay_status: 0,
        warehouse: "WH01",
        unit: "ลัง",
        trackorder: getQueueToday[0].trackorder
      }
      
      const result = await Order.findByIdAndUpdate(getQueueToday[0]._id, orderData, { new: true })
      console.log("orderData Have Data : ", orderData)
      return res.status(200).send({message:"Update Save After Finish Success ", data: result})
    }

    // console.log("getQueueToday : >>>>", getQueueToday)
   
      
      // return res.status(200).send({message:" Create Order Success ",data: {orderData}})
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

module.exports.UpdateStatusAferPay = async (req,res) => {
  try{
    var getId = req.body._id
    var getStatus = req.body.status
    var gentoInt = parseInt(getStatus)
    if(gentoInt == 1){
        var status = "FINISH"
    }else{
        var status = " "
    }
    console.log("status: ", status)
    console.log("_id : ", getId)

    const updateData = {
      $set: {
        status: status
      },
    };

    console.log("updateData : ", updateData)
    const result = await Order.findByIdAndUpdate(getId, updateData, { new: true })
    return res.status(200).send({message:" Update Status After Pay Success", data: {updateData, result}})
    
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.GetTrackOrder = async (req,res) => {
  try{
    var queue = req.body.queue
    var createAt = req.body.createAt
    const currentDate = new Date(createAt);
    const startOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate.toISOString().split('T')[0] + 'T23:59:59.999Z');
    console.log("queue : ", queue)
    console.log("createAt : ", createAt)
    var getOrderDataAll = await Order.find({
      queue: req.body.queue,
      createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    console.log(getOrderDataAll.trackorder)
    if(getOrderDataAll.trackorder.length == 0){
      console.log("THIS IS NULL")
    }
    console.log(getOrderDataAll.trackorder)
    // console.log("getOrderDataAll", getOrderDataAll)
    var getTrackOrder = await Order.find().select('trackorder')
    // console.log("getTrackOrder", getTrackOrder)
    return res.status(200).send({message:"Get Trackorder Success"})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.AmountOrderAfterSelect = async (req,res) => {
  try{
    const getOrderData = await Order.find({orderId: 97});
    const sumTotalsByDetailId = {};
    console.log("getOrderData : ", getOrderData[0].order_detail)

getOrderData[0].order_detail.forEach(item => {
  const { detail_id, qty, total, description } = item;
  if (!sumTotalsByDetailId[detail_id]) {
    sumTotalsByDetailId[detail_id] = { qty: 0, total: 0 };
  }
  qty = parseInt(qty)
  sumTotalsByDetailId[detail_id].description = description;
  sumTotalsByDetailId[detail_id].qty += qty;
  sumTotalsByDetailId[detail_id].total += total;
});

// const chkdata = {}
// getOrderData[0].order_detail.forEach(item => {
//   const { detail_id, description,qty,total } = item;
//   if (!chkdata[detail_id]) {
//     chkdata[detail_id] = { qty: 0, total: 0 };
//     chkdata[detail_id].qty += qty;
//     chkdata[detail_id].total += total;
//   }
//   chkdata[detail_id].description = description
// }
// )
// getOrderData[0].order_detail.forEach(data =>{
  // console.log("Description : ", data.description);
  // console.log("Detail_id : ", data.detail_id);
  // const getDetail = await category_detail.findOne()
// })
// console.log("chkdata", chkdata)
console.log("sumTotalsByDetailId : ",sumTotalsByDetailId)
const detailId = 6
    const findOrder = await Order.findOne({trackorder: "OD2012230006"})
    // console.log(findOrder)

    // console.log(findOrder.order_detail)
    const detailData = findOrder.order_detail
    var newdata = {}
    for (const detailDatas of detailData){
      console.log("detailsDatas : ",detailDatas.detail_id)
      // console.log(testdatas.detail_id)
      const newfindOrder = await category_detail.findOne({detail_id: detailDatas.detail_id}).select("detail_name_th")
      var i = 0
      // console.log("ID : ", detailDatas.detail_id)
      if(detailDatas.detail_id){

      }
      // newdata += testdatas.total
      // console.log(newdata," : ", i++)
      // console.log(testdatas.total)
    }
    // findOrder.order_detail.forEach(data2 => {
    //   console.log("data2", data2.detail_id)
    // console.log("newdata : ", newdata)
    // })
    // detailData.forEach(data => {
    //   console.log("Data : ", data)
    // })
    // console.log("findOrder", findOrder)
    return res.status(200).send({message:"Get Trackorder Success",data: sumTotalsByDetailId})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}
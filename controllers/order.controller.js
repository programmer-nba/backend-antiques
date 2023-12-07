var jwt = require("jsonwebtoken");
var Order = require("../models/antiques/antiques_order.model");
var Category = require("../models/antiques/antiques_category.model");
var Customer = require("../models/antiques/antiques_customers.model");

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


      console.log("genOrderId", genOrderId)
      
      return res.status(200).send({message:" Get Order Success ",data: getAllOrder})
  }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.CreateDataOrder = async (req,res) => {
  try{
    var items = req.body.items;
    const chk_first_data = await Order.find();

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
      { createAt: {
        $gte: startOfDay,
        $lte: endOfDay
      } }
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
      if(!req.body.customers){
          var customer = await Customer.findOne({_id: "6569a9f652f2871ab9e9cead"});
          var customerId = (customer._id).toString();
  
      }else{
          var customer = req.body.customers
          var customerId = customer._id
       
      }
      var getWarehouse = req.body.wherehouse
        let orderData = {
          orderId: genOrderId,
          customer_id: customerId,
          queue: newQueue,
          customer_class: req.body.customers ? req.body.customers.class : customer.class,
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
    console.log(getOrderFinishToday)
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
    console.log(getQueueToday)
    if(!getQueueToday){
      var newQueue = 1
    }else{
      var newQueue = getQueueToday.queue+1
    }
    console.log(newQueue)
    
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
    if (getQueueToday.length == 0)
    // มีการใช้ชื่อนี้ไปแล้ว
    return res.status(401).send({
      message: "ไม่คิวรายการนี้ในระบบ",
      status: false,
    });
    console.log("getQueueToday : ", getQueueToday)
    // console.log("QQQQ : ", getQueueToday['_id'])
    // console.log("ID : ", )
    const customer = await Customer.findOne({_id: getQueueToday.customer_id})
    // new Array(getQueueToday)
    console.log("customer", customer)
    let dataOrder = [
      getQueueToday,
      customer
    ]
    // console.log("Data Order", dataOrder)
    
    return res.status(200).send({message: "Get Last Queue Today",data: dataOrder }) 
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}

module.exports.ApproveOrder = async (req,res) => {
  try{
    var getIdToUpdate = req.body._id
    const updateData = {
      $set: {
        status: "APPROVE"
      },
    };

    // const updateCate = await Category.updateOne({category_id: getCateId}, {$set:{category_name_th: getCateName_th, getCateName_en: getCateName_en}})
    const result = await Order.findByIdAndUpdate(getIdToUpdate, updateData, { new: true })
    return res.status(200).send({message: "Approve Data Success",data: result })
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


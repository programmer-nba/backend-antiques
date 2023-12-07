var jwt = require("jsonwebtoken");
var Order = require("../models/antiques/antiques_order.model");
var Customer = require("../models/antiques/antiques_customers.model");
var Categories_detail = require("../models/antiques/antiques_categories_details.model");

const { google } = require("googleapis");
const fs = require('fs');
const multer = require('multer');
const category_vendor = require("../models/antiques/antiques_categories_vendors.model");
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.ReceiptOrder = async (req,res) => {
    try{
        const getOrderId = req.body.orderId
        const getOrder = await Order.findOne({orderId:getOrderId})
        const getCustomer = await Customer.findOne({_id: getOrder.customer_id})
        let ReceiptData = {
            queue: getOrder.queue,
            createAt: getOrder.createAt,
            id_card: getCustomer.id_card,
            customer_name_th: getCustomer.fullname_th,
            customer_name_en: getCustomer.fullname_en,
            orderList: getOrder.order_detail,
            total: getOrder.total,
            totalweight: getOrder.total_weight
        }
        console.log("getOrder", getOrder)
        console.log("getCustomer", getCustomer)
        return res.status(200).send({message: "Get Receipt Order Success", data: ReceiptData})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.ReceiptCashBill = async (req, res) => {
    try{
        const getOrderid = req.body.orderId
        const getOrder = await Order.findOne({orderId: getOrderid});
        const getCustomer = await Customer.findOne({_id: getOrder.customer_id})

        const Datetime = new Date(getOrder.createAt);
        const getDatetime = Datetime.getDate()+"/"+Datetime.getMonth()+"/"+Datetime.getFullYear()
        console.log("getDatetime : ", getDatetime)
  
        var data = getOrder.order_detail;
        const sumPrice = data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.total;
          }, 0);
          const sumWeight = data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.qty;
          }, 0);
        let cashBillData = {
            fullname_th: getCustomer.fullname_th,
            fullname_en: getCustomer.fullname_en,
            address: getCustomer.address,
            orderList: getOrder.order_detail,
            id_card: getCustomer.id_card,
            queue: getOrder.queue,
            totalPrice: sumPrice,
            totalWeight: sumWeight,
        
        }
        console.log("getOrder", getOrder)
        console.log("getCustomer", getCustomer)
        console.log("Total Price : ", sumPrice)
        console.log("Total Weight : ", sumWeight)
        console.log("Cash Bill Data : ", cashBillData)
        return res.status(200).send({message: "Get Receipt Cash Bill Success", data: cashBillData})
    }catch{
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.OrderSummaryReportByDate = async (req,res) => {
    try{
      var StartDateData = new Date(req.body.StartDate)
      var EndDateData = new Date(req.body.EndDate)
      const getSummaryData = await Order.find({
        createAt: {
            $gte: StartDateData, // Start Date
            $lte: EndDateData  // End Date
          }
        
    })
    const sumByDetailIdAndDate = {};

        // Loop through the data
        getSummaryData.forEach((order) => {
          // Extract the date from the order's createAt field
          const orderDate = new Date(order.createAt).toLocaleDateString();

          // Check if order has order_detail array
          if (order.order_detail && order.order_detail.length > 0) {
            // Loop through the order_detail array
            order.order_detail.forEach((detail) => {
              const detailId = detail.detail_id;
              const total = detail.total;

              // If sumByDetailIdAndDate already has a sum for the detail_id and date, add to it
              if (sumByDetailIdAndDate[detailId] && sumByDetailIdAndDate[detailId][orderDate]) {
                sumByDetailIdAndDate[detailId][orderDate] += total;
              } else {
                // If not, create a new entry for the detail_id and date
                if (!sumByDetailIdAndDate[detailId]) {
                  sumByDetailIdAndDate[detailId] = {};
                }
                sumByDetailIdAndDate[detailId][orderDate] = total;
              }
            });
          }
        });

    console.log("Sum by detail_id and date:", sumByDetailIdAndDate);
      return res.status(200).send({message: "Get Order Summary Report",data: sumByDetailIdAndDate})
    }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.PurchaseSummary = async (req,res) => {
    try{

        var StartDateData = new Date(req.body.StartDate)
        var EndDateData = new Date(req.body.EndDate)

        const getSummaryData = await Order.find({
            createAt: {
                $gte: StartDateData, // Start Date
                $lte: EndDateData  // End Date
              }
        })
        console.log("getSummaryData", getSummaryData)
        const chkonetwo = getSummaryData[0].order_detail
        const sumPrice = chkonetwo.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.total;
          }, 0);
          console.log("chkonetwo", chkonetwo)
          console.log("sumPrice", sumPrice)
        // console.log("chkonetwo", chkonetwo)
        // console.log("sumPrice", sumPrice)
        // console.log("StartDateData", StartDateData)
        // console.log("EndDateData", EndDateData)
        // console.log(getSummaryData[0].order_detail[0].detail_id);
        // for(let i = 0; i < getSummaryData.length; i++){
        //     console.log(getSummaryData[i].customer_class);
        //     const sumPrice = getSummaryData.reduce((accumulator, currentValue) => {
        //         return accumulator + currentValue.total;
        //       }, 0);
        //       console.log("sumPrice", sumPrice)
        // }
        const sumByDetailId = {};
        const calculateOrderDetailTotal = (order_detail) =>
        order_detail.reduce((sum, item) => sum + item.total, 0);
        const result = getSummaryData.map((document) => ({
            _id: document._id,
            totalOrderDetail: calculateOrderDetailTotal(document.order_detail),
          }));
        // console.log(result);

        getSummaryData.forEach((order) => {
            if(order.order_detail && order.order_detail.length > 0){
                // console.log(order.order_detail)
                order.order_detail.forEach((detail) => {
                    const detailId = detail.detail_id;
                    const qty = detail.qty;
                    const total = detail.total;
                    const description = detail.description;
                    const startDate = req.body.StartDate
                    const endDate = req.body.EndDate
                    const unit = "KG";
                    
                    
                    if (sumByDetailId[detailId]) {
                        sumByDetailId[detailId].total += total;
                        sumByDetailId[detailId].qty += qty;
                        sumByDetailId[detailId].unit = unit;
                        sumByDetailId[detailId].description = description;
                        sumByDetailId[detailId].startDate = startDate;
                        sumByDetailId[detailId].endDate = endDate;
                      } else {
                        // If not, create a new entry for the detail_id
                        sumByDetailId[detailId] = { total,
                                                    qty,
                                                    unit,
                                                    description,
                                                    startDate,
                                                    endDate
                                                  };

                      }
                }
                )     
            }
        }

        )
        console.log("Sum by detail_id:", sumByDetailId);

        const sumByDetailIdAndDate = {};

        // Loop through the data
        getSummaryData.forEach((order) => {
          // Extract the date from the order's createAt field
          const orderDate = new Date(order.createAt).toLocaleDateString();

          // Check if order has order_detail array
          if (order.order_detail && order.order_detail.length > 0) {
            // Loop through the order_detail array
            order.order_detail.forEach((detail) => {
              const detailId = detail.detail_id;
              const total = detail.total;

              // If sumByDetailIdAndDate already has a sum for the detail_id and date, add to it
              if (sumByDetailIdAndDate[detailId] && sumByDetailIdAndDate[detailId][orderDate]) {
                sumByDetailIdAndDate[detailId][orderDate] += total;
              } else {
                // If not, create a new entry for the detail_id and date
                if (!sumByDetailIdAndDate[detailId]) {
                  sumByDetailIdAndDate[detailId] = {};
                }
                sumByDetailIdAndDate[detailId][orderDate] = total;
              }
            });
          }
        });
    console.log("Sum by detail_id and date:", sumByDetailIdAndDate);
          
    return res.status(200).send({message:"Get PurchaseSummary Success",data: sumByDetailId })
    }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
    }
}
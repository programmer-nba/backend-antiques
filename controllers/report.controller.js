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
            totalweight: getOrder.total_weight,
            trackorder: getOrder.trackorder
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
          
          const numberString = sumPrice.toString();
          const bahtWords = convertToBahtWords(numberString);
          console.log(" : ", bahtWords)
        let cashBillData = {
            fullname_th: getCustomer.fullname_th,
            fullname_en: getCustomer.fullname_en,
            address: getCustomer.address,
            orderList: getOrder.order_detail,
            id_card: getCustomer.id_card,
            queue: getOrder.queue,
            totalPrice: sumPrice,
            totalWeight: sumWeight,
            createAt: getDatetime,
            bathText: bahtWords
        
        }
        console.log("getOrder", getOrder)
        console.log("getCustomer", getCustomer)
        console.log("Total Price : ", sumPrice)
        console.log("Total Weight : ", sumWeight)
        console.log("Cash Bill Data : ", cashBillData)
        return res.status(200).send({message: "Get Receipt Cash Bill Success", data: cashBillData})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.OrderSummaryReportByDate = async (req,res) => {
    try{
      console.log("dadaadadad ")
      var StartDateData = new Date(req.body.StartDate)
      var EndDateData = new Date(req.body.EndDate)
      const getSummaryData = await Order.find({
        createAt: {
            $gte: StartDateData, // Start Date
            $lte: EndDateData  // End Date
          }
        
    })
    function calculateTotalByDay(getSummaryData) {
      const totalsByDay = {};
    
      getSummaryData.forEach(order => {
        const createDate = new Date(order.createAt);
        // Extract the date part (YYYY-MM-DD)
        const dayKey = createDate.toISOString().split('T')[0];
        // Initialize total for the day if not present
        if (!totalsByDay[dayKey]) {
          totalsByDay[dayKey] = 0;
        }
        // Extract and parse the "total" value, adding it to the total for the day
        const orderTotal = parseFloat(order.total);
        if (!isNaN(orderTotal)) {
          totalsByDay[dayKey] += orderTotal;
        }
      });
      return totalsByDay;
    }
  
    // Example: Calculate total amount by day
    const totalAmountByDay = calculateTotalByDay(getSummaryData);
    // console.log('Total Amount by Day:', totalAmountByDay);

    function calculateOverallSum(totalAmountByDay) {
      let overallSum = 0;
    
      // Iterate through the values and sum them up
      Object.values(totalAmountByDay).forEach(value => {
        overallSum += value;
      });
    
      return overallSum;
    }
    
    // Example: Calculate the overall sum
    const overallSum = calculateOverallSum(totalAmountByDay);
    let dataOrderSummaryReport = {
      data: totalAmountByDay,
      amount: overallSum
    }
    // console.log('dataOrderSummaryReport :', dataOrderSummaryReport);

    // const sumPrice = totalAmountByDay.reduce((accumulator, currentValue) => {
    //   return accumulator + currentValue.total;
    // }, 0);
    // function calculateTotal(data) {
    //   return data.reduce((total, order) => {
    //     // Extract and parse the "total" value, adding it to the total accumulator
    //     const orderTotal = parseFloat(order.total);
    //     return isNaN(orderTotal) ? total : total + orderTotal;
    //   }, 0);
    // }
    // const sumByDetailIdAndDate = {};

    //     // Loop through the data
    //     getSummaryData.forEach((order) => {
    //       // Extract the date from the order's createAt field
    //       const orderDate = new Date(order.createAt).toLocaleDateString();

    //       // Check if order has order_detail array
    //       if (order.order_detail && order.order_detail.length > 0) {
    //         // Loop through the order_detail array
    //         order.order_detail.forEach((detail) => {
    //           const detailId = detail.detail_id;
    //           const total = detail.total;

    //           // If sumByDetailIdAndDate already has a sum for the detail_id and date, add to it
    //           if (sumByDetailIdAndDate[detailId] && sumByDetailIdAndDate[detailId][orderDate]) {
    //             sumByDetailIdAndDate[detailId][orderDate] += total;
    //           } else {
    //             // If not, create a new entry for the detail_id and date
    //             if (!sumByDetailIdAndDate[detailId]) {
    //               sumByDetailIdAndDate[detailId] = {};
    //             }
    //             sumByDetailIdAndDate[detailId][orderDate] = total;
    //           }
    //         });
    //       }
    //     });
    //     var getSummaryData2 = getSummaryData
    //     const summaryByDate = {};

    //     getSummaryData2.forEach(order => {
    //       const orderDate = new Date(order.createAt).toLocaleDateString(); // Extract the date part
      
    //       if (!summaryByDate[orderDate]) {
    //         summaryByDate[orderDate] = {
    //           totalAmount: 0,
    //           getSummaryData2: [],
    //         };
    //       }
      
    //       const orderTotal = parseFloat(order.total) || 0;
    //       summaryByDate[orderDate].totalAmount += orderTotal;

    //       summaryByDate[orderDate].getSummaryData2.push(getSummaryData2);
    //     });
        
    //     return "summaryByDate : "+summaryByDate;
        
      // console.log("getSummaryData : ", getSummaryData)
    // console.log("Sum by detail_id and date:", dataOrderSummaryReport);
      return res.status(200).send({message: "Get Order Summary Report",data: dataOrderSummaryReport})
    }catch(error){
      return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.PurchaseSummary = async (req,res) => {
    try{
        if(req.body.StartDate.length == 0 && req.body.EndDate.length == 0){
          const getAllDate = await Order.find().sort({ orderId: -1 })
          console.log("getAllDate", getAllDate)
          return res.status(200).send({message:"Get All Data Success", data: getAllDate})
        }else{

          var StartDateData = new Date(req.body.StartDate)
          var EndDateData = new Date(req.body.EndDate)
          console.log("StartDate : ", req.body.StartDate.length)
          const getSummaryData = await Order.find({
              createAt: {
                  $gte: StartDateData, // Start Date
                  $lte: EndDateData  // End Date
                }
          })
      
          const chkonetwo = getSummaryData[0].order_detail
          const sumPrice = chkonetwo.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.total;
            }, 0);
          
          const sumByDetailId = {};
          const calculateOrderDetailTotal = (order_detail) =>
          order_detail.reduce((sum, item) => sum + item.total, 0);
          const result = getSummaryData.map((document) => ({
              _id: document._id,
              totalOrderDetail: calculateOrderDetailTotal(document.order_detail),
  
            }));
          // console.log("order_detail", getSummaryData[0].order_detail);
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
                      // console.log("order.order_detail", detail.detail_id)
                      
                      
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
          
          // console.log("sumByDetailId : ", sumByDetailId)
  
  
      return res.status(200).send({message:"Get PurchaseSummary Success",data: sumByDetailId })
        }
       
    }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.OverviewAntiques = async (req, res) => {
try{
  var getCreateAt = new Date("2023-12-07T02:34:30.272+00:00")
  console.log("createAt : ", getCreateAt)
  var getOderdata = await Order.findOne({
    createAt: getCreateAt
  })
  console.log("getOderdata", getOderdata);
  
  const getOrderData = await Order.aggregate([
    {
      $match: {
        createAt: new RegExp('2023-12', 'i')
      }
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
        message: 'Get Data Success',
        getCateOrder: {
          _id: '$_id',
          status: '$status',
          fullname_th: '$customerData.fullname_th',
          fullname_en: '$customerData.fullname_en',
          class: '$customerData.class',
          order_detail: '$customerData.order_detail',
          total: '$customerData.total',
          // all_details: 1
        },
      }
    }
    // Additional stages in the aggregation pipeline if needed
  ]);

  const getfromcustomer = await Customer.find();

  // console.log("getOrderData : ", getOrderData)
  return res.status(200).send({message: "Get Overview Success", data: getfromcustomer})
  }catch(error){
    return res.status(500).send({message: "Internal server error", error: error.message});
  }
}
const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema(
    {
        orderId : {type:Number},
        customer_id: {type:String},
        customer_class: {type:String},
        order_detail: {type:Array},
        total: {type:Number},
        total_weight:{type:Number},
        createAt:{type:Date},
        queue: {type:Number},
        status: {type:String},
        pay_status: {type:Number},
        warehouse: {type:String},
        unit: {type:String},
        detail_id: {type:Number},
        trackorder: {type:String}
    },
    {timestamp: true}
);

const order = mongoose.model('Order', orderSchema);
module.exports =  order ;

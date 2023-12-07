const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = new mongoose.Schema(
    {
        orderId : {type:Number},
        customer_id: {type:String},
        customer_class: {type:String},
        order_detail: {type:Array},
        total: {type:String},
        total_weight:{type:String},
        createAt:{type:Date},
        queue: {type:Number},
        status: {type:String},
        pay_status: {type:Number},
        warehouse: {type:String},
        unit: {type:String},
        detail_id: {type:Number}
    },
    {timestamp: true}
);

const order = mongoose.model('Order', orderSchema);
module.exports =  order ;

const mongoose = require("mongoose");
const Joi = require("joi");

const catevendorSchema = new mongoose.Schema(
    {
        vendor_id :{type:Number},
        vendor_data :{type:String},
        remark:{type:String}
        
    },
    {timestamp: true}
);

const category_vendor = mongoose.model('Categories_vendor', catevendorSchema);
module.exports =  category_vendor ;

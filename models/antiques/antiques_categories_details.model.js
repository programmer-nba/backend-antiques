const mongoose = require("mongoose");
const Joi = require("joi");

const catedetailSchema = new mongoose.Schema(
    {
        detail_id : {type: Number},
        detail_name_th :{type:String},
        detail_name_en :{type:String},
        detail_cost :{type:String},
        unit:{type:String},
        type_id:{type:Number},
        vendor_id:{type:Number},
        delete_status: {type:Number}
        

    },
    {timestamp: true}
);

const category_detail = mongoose.model('Categories_detail', catedetailSchema);
module.exports =  category_detail ;

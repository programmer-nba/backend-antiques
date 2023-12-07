const mongoose = require("mongoose");
const Joi = require("joi");

const antiquesSchema = new mongoose.Schema(
    {
        category_id : {type: Number},
        category_name_th :{type:String},
        category_name_en : {type:String},
        delete_status: {type:Number}
       
    },
    {timestamp: true}
);

const category = mongoose.model('Category', antiquesSchema);
module.exports =  category ;

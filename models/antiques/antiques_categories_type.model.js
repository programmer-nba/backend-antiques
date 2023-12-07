const mongoose = require("mongoose");
const Joi = require("joi");

const category_typeSchema = new mongoose.Schema(
    {
        type_id : {type: Number},
        detail_th :{type:String},
        detail_en :{type:String},
        category_id :{type:Number},
        delete_status: {type:Number}

    },
    {timestamp: true}
);

const category_Type = mongoose.model('Categories_type', category_typeSchema);
module.exports =  category_Type ;

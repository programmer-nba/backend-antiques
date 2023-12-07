const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema(
    {
        id_card : {type: String},
        class: {type:String},
        fullname_th :{type:String},
        fullname_en : {type:String},
        birthday_th : {type: String},
        birthday_en : {type: String},
        religion : {type: String},
        address: {type:String},
        date_of_issue : {type:String},
        date_of_expiry : {type:String},
        vehicle: {type:String},
        vehicle_detail: {type:String},
        createAt:{type:Date},
        updateAt:{type:Date},
        
       
    },
    {timestamp: true}
);

const customer = mongoose.model('Customer', customerSchema);
module.exports =  customer ;

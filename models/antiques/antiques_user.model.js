const mongoose = require("mongoose");
const Joi = require("joi");

const adminantiquesSchema = new mongoose.Schema(
    {
        name:{type:String},
        telephone: {type:String},
        class :{type:String},
        vehicle: {type: String},
        createAt:{type:Date},
        updateAt:{type:Date}

    },
    {timestamp: true}
);

const admin_register = mongoose.model('User', adminantiquesSchema);
module.exports =  admin_register ;

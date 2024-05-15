const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema(
    {
        id_card: { type: String },
        level: { type: Number },
        fullname: { type: String },
        tel: { type: String },
        address: { type: String },
        subdistrict: { type: String },
        district: { type: String },
        province: { type: String },
        postcode: { type: String },
        vehicle_code: { type: String },
        emp: { type: String, required: false, default: 'ไม่มี' },
        timestamp: { type: Date, required: false, default: Date.now() },
    },
    { timestamp: true }
);

const customer = mongoose.model('Customer', customerSchema);
module.exports = customer;

var jwt = require("jsonwebtoken");
var Customer = require("../models/antiques/antiques_customers.model");
const { google } = require("googleapis");
const fs = require('fs');
const multer = require('multer');
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.getCustomer = async (req, res) => {
    try{
        const chkData = await Customer.find();
        console.log(process.env)
        console.log("req-files",req.files)
        return res.status(200).send({message: "Get Data Successfully", data: chkData})
    }catch{
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.createCustomer = async (req, res) => {
    try{
        
        const chkCusName = await Customer.find({$or: [{fullname_th: req.body.fullname_th},{id_card:  req.body.id_card}]});
        if (chkCusName.length > 0)
        // มีการใช้ชื่อนี้ไปแล้ว
        return res.status(401).send({
          message: "มีชื่อลูกค้านี้ในระบบแล้ว",
          status: false,
        });
        let dataCus = {
            id_card : req.body.id_card,
            class: req.body.class ? req.body.class: "D",
            fullname_th : req.body.fullname_th,
            fullname_en : req.body.full_name_en,
            birthday_th : req.body.birthday_th,
            birthday_en : req.body.birthday_en,
            religion : req.body.religion,
            address : req.body.address,
            date_of_issue : req.body.date_of_issue,
            date_of_expiry : req.body.date_of_expiry,
            vehicle : req.body.vehicle,
            createAt : Date.now(),
            updateAt : Date.now(),
            vehicle_detail : req.body.vehicle_detail
        }

        const createCustomer = new Customer(dataCus);
        const CreateCustomerData = await createCustomer.save();

        console.log(dataCus);
        return res.status(200).send({message:"Create Data Customer Succesfully",data: dataCus})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.filterCusByData = async (req,res) => {
    try{
        var fullname_th = req.body.fullname_th;
        filterCus = await Customer.find({
                                           
                                            fullname_th: new RegExp(fullname_th),
                                            id_card: new RegExp(req.body.id_card),
                                            vehicle: new RegExp(req.body.vehicle)
                                          
                                        });
        console.log(filterCus)
        return res.status(200).send({message: "Getdata Success", data: filterCus})
    }catch(error){
        res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.UpdateCustomer = async (req,res) => {
    try{
        var cusID = req.body._id;
        var fullname_th = req.body.fullname_th
        console.log(cusID)
        var getCus = await Customer.findOne({_id: cusID});
        let DataUpdateCus = {
            $set: {
                id_card: req.body.id_card ? id_card: getCus.id_card,
                fullname_th: req.body.fullname_th ? req.body.fullname_th: getCus.fullname_th,
                fullname_en: req.body.fullname_en ? req.body.fullname_en: getCus.fullname_en,
                birthday_th: req.body.birthday_th ? req.body.birthday_th: getCus.birthday_th,
                birthday_en: req.body.birthday_en ? req.body.birthday_en: getCus.birthday_en,
                religion: req.body.religion ? req.body.religion: getCus.religion,
                address: req.body.address ? req.body.address: getCus.address,
                date_of_issue: req.body.date_of_issue ? req.body.date_of_issue: getCus.date_of_issue,
                date_of_expiry: req.body.date_of_expiry ? req.body.date_of_expiry: getCus.date_of_expiry,
                vehicle: req.body.vehicle ? req.body.vehicle: getCus.vehicle,
                vehicle_detail: req.body.vehicle_detail ? req.body.vehicle_detail: getCus.vehicle_detail,
            }
        }

        const result = await Customer.findByIdAndUpdate(cusID, DataUpdateCus, { new: true })
        console.log(DataUpdateCus);
        return res.status(200).send({message:"Update DATA Successfully", data: {getCus, result}})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.testCreateImage = async (req, res) => {
    try{
        console.log(req.files)

        return res.status(200).send({message:"Create Image Successfully"});
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.DropdownCusID = async (req,res) => {
    try{
        var getDropdownCusID = await Customer.find().select("id_card");
        return res.status(200).send({message:"Get Dropdown Success",data: getDropdownCusID})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}
module.exports.DropdownCusName = async (req,res) => {
    try{
        var getDropdownCusName = await Customer.find().select("fullname_th");
        return res.status(200).send({message:"Get Dropdown Success",data: getDropdownCusName})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

module.exports.DropdownCusVehicle = async (req,res) => {
    try{
        var getDropdownCusVehicle = await Customer.find().select("vehicle");
        return res.status(200).send({message:"Get Dropdown Success",data: getDropdownCusVehicle})
    }catch(error){
        return res.status(500).send({message: "Internal server error", error: error.message});
    }
}

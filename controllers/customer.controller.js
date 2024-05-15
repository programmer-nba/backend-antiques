var jwt = require("jsonwebtoken");
var Customer = require("../models/user/antiques_customers.model");
const { google } = require("googleapis");
const fs = require('fs');
const multer = require('multer');
const dayjs = require("dayjs");
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.getCustomer = async (req, res) => {
    try {
        const chkData = await Customer.find();
        console.log(process.env)
        console.log("req-files", req.files)
        return res.status(200).send({ message: "Get Data Successfully", data: chkData })
    } catch {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.createCustomer = async (req, res) => {
    try {

        const chkCusName = await Customer.find({ $or: [{ fullname: req.body.fullname }, { id_card: req.body.id_card }, { tel: req.body.tel }] });
        if (chkCusName.length > 0)
            // มีการใช้ชื่อนี้ไปแล้ว
            return res.status(401).send({
                message: "มีลูกค้านี้ในระบบแล้ว",
                status: false,
            });
        let dataCus = {
            id_card: req.body.id_card,
            level: req.body.level ? req.body.level : 5,
            fullname: req.body.fullname,
            tel: req.body.tel,
            address: req.body.address,
            subdistrict: req.body.subdistrict,
            district: req.body.district,
            province: req.body.province,
            postcode: req.body.postcode,
            vehicle_code: req.body.vehicle_code,
            emp: req.body.emp,
            timestamp: dayjs(Date.now()).format(""),
        };
        const createCustomer = new Customer(dataCus);
        createCustomer.save();
        console.log(createCustomer);
        return res.status(200).send({ message: "เพิ่มลูกค้าสำเร็จ", data: createCustomer })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.filterCusByData = async (req, res) => {
    try {
        var fullname_th = req.body.fullname_th;
        filterCus = await Customer.find({

            fullname_th: new RegExp(fullname_th),
            id_card: new RegExp(req.body.id_card),
            vehicle: new RegExp(req.body.vehicle)

        });
        console.log(filterCus)
        return res.status(200).send({ message: "Getdata Success", data: filterCus })
    } catch (error) {
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.UpdateCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        Customer.findByIdAndUpdate(id, { ...req.body }, { useFindAndModify: false }).then((data) => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Advert with id=${id}. Maybe Advert was not found!`,
                });
            } else
                res.status(201).send({
                    message: "แก้ไขข้อมูลลูกค้าสำเร็จ.",
                    status: true,
                });
        }).catch((err) => {
            res.status(500).send({
                message: "Error updating Advert with id=" + id,
                status: false,
            });
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.DeleteCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        Customer.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Advert with id=${id}. Maybe Advert was not found!`,
                });
            } else
                res.status(201).send({
                    message: "ลบข้อมูลลูกค้าสำเร็จ.",
                    status: true,
                });
        }).catch((err) => {
            res.status(500).send({
                message: "Error updating Advert with id=" + id,
                status: false,
            });
        });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.testCreateImage = async (req, res) => {
    try {
        console.log(req.files)

        return res.status(200).send({ message: "Create Image Successfully" });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.DropdownCusID = async (req, res) => {
    try {
        var getDropdownCusID = await Customer.find().select("id_card");
        return res.status(200).send({ message: "Get Dropdown Success", data: getDropdownCusID })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}
module.exports.DropdownCusName = async (req, res) => {
    try {
        var getDropdownCusName = await Customer.find().select("fullname_th");
        return res.status(200).send({ message: "Get Dropdown Success", data: getDropdownCusName })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

module.exports.DropdownCusVehicle = async (req, res) => {
    try {
        var getDropdownCusVehicle = await Customer.find().select("vehicle");
        return res.status(200).send({ message: "Get Dropdown Success", data: getDropdownCusVehicle })
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
}

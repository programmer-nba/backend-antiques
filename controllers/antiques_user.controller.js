var jwt = require("jsonwebtoken");
var User = require("../models/user/antiques_employee.model");

const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.CreateUser = async (req,res) => {
    try{

        const name = req.body.name;
        const telephone = req.body.telephone;
        const userclass = req.body.userclass;
        const vehicle = req.body.vehicle;
        const createAt = Date.now();
        const updateAt = Date.now();

        
        let userData = {
            name: name,
            telephone: telephone,
            userclass: userclass,
            vehicle: vehicle,
            createAt: createAt,
            updateAt: updateAt
        }
        const chk_user = await User.find({name: name});
        if(chk_user.length>0){
        return res.status(200).send({message: "Sucess"})
        }
        console.log(chk_user)
        return res.status(200).send({message: "Sucess"})

    }catch(error){
        return res.status(500).send({message: "Internal Server Error"});
    }
}